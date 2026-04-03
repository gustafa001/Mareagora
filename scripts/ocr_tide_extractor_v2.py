import pytesseract
from pdf2image import convert_from_path
import re
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from PIL import Image, ImageFilter, ImageEnhance
import logging

class ScannedTideTableExtractor:
    """Extrator OCR otimizado para 4 marés por dia"""
    
    def __init__(self, config: dict = None):
        self.config = config or self._default_config()
        # Garante que a pasta logs existe
        os.makedirs('logs', exist_ok=True)
        self.setup_logging()
        
    def _default_config(self) -> dict:
        return {
            "tesseract_lang": "por",
            "tesseract_config": "--oem 3 --psm 6",
            "dpi": 300,
            "preprocess": True,
            "min_tides_per_day": 2,
            "max_tides_per_day": 4,  # ⭐ CRÍTICO: Máximo 4 marés
            "altura_min": 0.0,
            "altura_max": 10.0,
            "porto_lookup": {
                "SÃO SEBASTIÃO": "SÃO PAULO",
                "SUAPE": "PERNAMBUCO",
                "SÃO LUÍS": "MARANHÃO",
                "TERMINAL ALUMAR": "MARANHÃO",
                "TERMINAL DE BARRA DO RIACHO": "ESPÍRITO SANTO",
                "PORTO DE SANTANA": "AMAPÁ",
                "BARRA NORTE": "AMAPÁ"
            }
        }
    
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/ocr_extraction.log', encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def preprocess_image(self, image: Image) -> Image:
        """Pré-processa imagem para melhor OCR"""
        if not self.config.get("preprocess", True):
            return image
        
        # Converter para escala de cinza
        image = image.convert('L')
        
        # Aumentar contraste
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)
        
        # Aumentar brilho
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.2)
        
        # Nitidez
        image = image.filter(ImageFilter.SHARPEN)
        
        return image
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extrai texto de PDF escaneado usando OCR"""
        try:
            self.logger.info(f"Convertendo PDF para imagens: {pdf_path}")
            
            images = convert_from_path(
                pdf_path, 
                dpi=self.config.get("dpi", 300),
                fmt='PNG'
            )
            
            texto_completo = ""
            
            for i, image in enumerate(images):
                self.logger.info(f"Processando página {i+1}/{len(images)}")
                
                image = self.preprocess_image(image)
                
                texto = pytesseract.image_to_string(
                    image,
                    lang=self.config.get("tesseract_lang", "por"),
                    config=self.config.get("tesseract_config", "--oem 3 --psm 6")
                )
                
                texto_completo += texto + "\n"
            
            return texto_completo
            
        except Exception as e:
            self.logger.error(f"Erro no OCR de {pdf_path}: {str(e)}")
            return ""
    
    def extract_metadata(self, text: str, filename: str) -> dict:
        """Extrai metadados do porto"""
        metadata = {
            "porto": "",
            "estado": "",
            "lat": "",
            "lon": "",
            "fuso": "UTC-03:00",
            "nivel_medio": 0.0
        }
        
        # Extrair nome do porto
        porto_patterns = [
            r"PORTO DE ([\w\s]+?)(?:-|CIA|ESTADO|$)",
            r"CIA DOCAS DE ([\w\s]+?)(?:-|ESTADO|$)",
            r"TERMINAL ([\w\s]+?)(?:-|ESTADO|$)",
        ]
        
        for pattern in porto_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                metadata["porto"] = match.group(1).strip().upper()
                break
        
        if not metadata["porto"]:
            filename_clean = filename.split(os.sep)[-1].replace('.pdf', '').upper()
            metadata["porto"] = re.sub(r'[_\-\d]+', ' ', filename_clean).strip()
        
        # Extrair estado do lookup
        for porto_key, estado in self.config["porto_lookup"].items():
            if porto_key in metadata["porto"].upper():
                metadata["estado"] = estado
                break
        
        # Extrair coordenadas
        lat_match = re.search(r"Latitude\s*([\d°\s\.\']+?\s*[NS])", text, re.IGNORECASE)
        lon_match = re.search(r"Longitude\s*([\d°\s\.\']+?\s*[WE])", text, re.IGNORECASE)
        
        if lat_match:
            metadata["lat"] = lat_match.group(1).strip()
        if lon_match:
            metadata["lon"] = lon_match.group(1).strip()
        
        # Extrair fuso
        fuso_match = re.search(r"Fuso\s*(UTC[\-\+]\d+\.?\d*)", text, re.IGNORECASE)
        if fuso_match:
            metadata["fuso"] = fuso_match.group(1)
        
        # Extrair nível médio
        nivel_match = re.search(r"Nível Médio\s*([\d]+\.[\d]+)\s*m", text, re.IGNORECASE)
        if nivel_match:
            metadata["nivel_medio"] = float(nivel_match.group(1))
        
        return metadata
    
    def is_leap_year(self, year: int) -> bool:
        return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)
    
    def select_best_tides(self, mares: List[dict], max_tides: int = 4) -> List[dict]:
        """
        ⭐ SELECIONA AS MELHORES 4 MARÉS
        Prioriza: horas únicas + alturas variadas (preamar/baixamar)
        """
        if len(mares) <= max_tides:
            return mares
        
        # Agrupar por hora (remover duplicatas exatas)
        horas_unicas = {}
        for mare in mares:
            key = mare.get('hora', '')
            if key not in horas_unicas:
                horas_unicas[key] = mare
            else:
                # Manter altura mediana se houver variação
                existing = horas_unicas[key]
                if abs(mare['altura_m'] - existing['altura_m']) < 0.1:
                    continue  # Ignorar variação mínima
        
        mares_unicos = list(horas_unicas.values())
        
        if len(mares_unicos) <= max_tides:
            return mares_unicos
        
        # Ordenar por hora
        mares_unicos.sort(key=lambda x: x.get('hora', '00:00'))
        
        # Selecionar marés mais representativas
        selecionadas = []
        alturas = [m['altura_m'] for m in mares_unicos]
        mediana = sum(alturas) / len(alturas)
        
        preamares = [m for m in mares_unicos if m['altura_m'] >= mediana]
        baixamares = [m for m in mares_unicos if m['altura_m'] < mediana]
        
        for lista in [preamares, baixamares]:
            lista.sort(key=lambda x: x.get('hora', '00:00'))
            for i, mare in enumerate(lista):
                if len(selecionadas) < max_tides:
                    if not any(
                        abs(self._hora_to_min(mare['hora']) - self._hora_to_min(s['hora'])) < 30
                        for s in selecionadas
                    ):
                        selecionadas.append(mare)
        
        selecionadas.sort(key=lambda x: x.get('hora', '00:00'))
        return selecionadas[:max_tides]
    
    def _hora_to_min(self, hora: str) -> int:
        try:
            parts = hora.split(':')
            return int(parts[0]) * 60 + int(parts[1])
        except:
            return 0
    
    def extract_tide_data(self, text: str, year: int) -> List[dict]:
        eventos = []
        linhas = text.split('\n')
        
        dia_atual = None
        mes_atual = None
        mares_do_dia = []
        ultimo_dia_salvo = None
        
        meses = {
            'JANEIRO': 1, 'FEVEREIRO': 2, 'MARÇO': 3, 'ABRIL': 4,
            'MAIO': 5, 'JUNHO': 6, 'JULHO': 7, 'AGOSTO': 8,
            'SETEMBRO': 9, 'OUTUBRO': 10, 'NOVEMBRO': 11, 'DEZEMBRO': 12
        }
        
        tide_patterns = [
            r"(\d{4})\s+([\d]+\.[\d]+)",
            r"(\d{2}:\d{2})\s+([\d]+\.[\d]+)",
        ]
        
        for linha in linhas:
            linha_upper = linha.upper()
            for mes_nome, mes_num in meses.items():
                if mes_nome in linha_upper:
                    mes_atual = mes_num
                    break
            
            dia_match = re.match(r"^\s*(\d{1,2})\s+", linha)
            if dia_match and mes_atual:
                if dia_atual and mares_do_dia:
                    mares_selecionadas = self.select_best_tides(mares_do_dia)
                    if len(mares_selecionadas) >= self.config["min_tides_per_day"]:
                        data_key = f"{year}-{mes_atual:02d}-{dia_atual:02d}"
                        if data_key != ultimo_dia_salvo:
                            eventos.append({"data": data_key, "mares": mares_selecionadas})
                            ultimo_dia_salvo = data_key
                
                dia_atual = int(dia_match.group(1))
                mares_do_dia = []
            
            for pattern in tide_patterns:
                tide_matches = re.findall(pattern, linha)
                for hora, altura in tide_matches:
                    try:
                        hora_formatada = hora if ':' in hora else f"{hora[:2]}:{hora[2:]}"
                        datetime.strptime(hora_formatada, "%H:%M")
                        altura_float = float(altura)
                        if self.config["altura_min"] <= altura_float <= self.config["altura_max"]:
                            mares_do_dia.append({"hora": hora_formatada, "altura_m": altura_float})
                    except: continue
        
        if dia_atual and mes_atual and mares_do_dia:
            mares_selecionadas = self.select_best_tides(mares_do_dia)
            if len(mares_selecionadas) >= self.config["min_tides_per_day"]:
                data_key = f"{year}-{mes_atual:02d}-{dia_atual:02d}"
                if data_key != ultimo_dia_salvo:
                    eventos.append({"data": data_key, "mares": mares_selecionadas})
        return eventos
    
    def extract_year_from_filename(self, filename: str) -> int:
        match = re.search(r'(\d{4})', filename)
        return int(match.group(1)) if match else 2025
    
    def clean_keys(self, data: dict) -> dict:
        cleaned = {}
        for key, value in data.items():
            clean_key = key.strip()
            if isinstance(value, dict): cleaned[clean_key] = self.clean_keys(value)
            elif isinstance(value, list): cleaned[clean_key] = [self.clean_keys(item) if isinstance(item, dict) else item for item in value]
            else: cleaned[clean_key] = value
        return cleaned
    
    def extract_from_pdf(self, pdf_path: str) -> Optional[dict]:
        try:
            self.logger.info(f"=== Processando OCR: {pdf_path} ===")
            year = self.extract_year_from_filename(pdf_path)
            texto_completo = self.extract_text_from_pdf(pdf_path)
            if not texto_completo.strip(): return None
            metadata = self.extract_metadata(texto_completo, pdf_path)
            eventos = self.extract_tide_data(texto_completo, year)
            if not eventos: return None
            dados = {
                "porto": metadata["porto"] or "PORTO DESCONHECIDO",
                "estado": metadata["estado"] or "",
                "lat": metadata["lat"] or "",
                "lon": metadata["lon"] or "",
                "fuso": metadata["fuso"],
                "nivel_medio": metadata["nivel_medio"],
                "ano": year,
                "eventos": eventos
            }
            return self.clean_keys(dados)
        except Exception as e:
            self.logger.error(f"Erro crítico em {pdf_path}: {str(e)}")
            return None
    
    def save_json(self, data: dict, output_path: str):
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        self.logger.info(f"Salvo: {output_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Uso: python ocr_tide_extractor_v2.py <pdf_path> <output_json>")
        sys.exit(1)
    
    extractor = ScannedTideTableExtractor()
    result = extractor.extract_from_pdf(sys.argv[1])
    if result:
        extractor.save_json(result, sys.argv[2])
    else:
        print("Falha na extração OCR.")
