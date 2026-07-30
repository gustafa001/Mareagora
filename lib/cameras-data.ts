export type CameraSource = 'youtube' | 'twitch';

export type CameraStatus = 'active' | 'testing' | 'inactive';

export interface BeachCamera {
  id: string;
  name: string; // nome da praia/local
  city: string;
  state: string; // sigla, ex: "SP", "RJ"
  region: string; // ex: "Baixada Santista", "Litoral Norte SP", "Rio de Janeiro"
  source: CameraSource;
  embedId: string; // video ID do YouTube ou canal da Twitch
  description?: string; // breve descrição do que a câmera mostra
  credit: string; // nome do canal/fonte original, para dar crédito
  creditUrl: string; // link para o canal/fonte original
  status: CameraStatus; // 'active' = confirmado funcionando, 'testing' = precisa validar embed, 'inactive' = removido/quebrado
}

export const beachCameras: BeachCamera[] = [
  // ===== BAIXADA SANTISTA =====
  {
    id: 'santos-orla',
    name: 'Orla de Santos',
    city: 'Santos',
    state: 'SP',
    region: 'Baixada Santista',
    source: 'youtube',
    embedId: '_0cC9iaQS_Y', // buscar o video ID atual do canal "Santos ao vivo 24h"
    description: 'Vista da orla da praia de Santos, divisa com São Vicente e Av. Ana Costa',
    credit: 'Canal Santos ao vivo 24h (YouTube)',
    creditUrl: 'https://www.youtube.com/watch?v=_0cC9iaQS_Y',
    status: 'active',
  },
  {
    id: 'bertioga-morada-da-praia',
    name: 'Praia de Bertioga (Morada da Praia)',
    city: 'Bertioga',
    state: 'SP',
    region: 'Baixada Santista',
    source: 'twitch',
    embedId: '', // identificar o canal da Twitch do Condomínio Morada da Praia
    description: 'Vista da praia e mar em Bertioga, transmitida pelo Condomínio Morada da Praia',
    credit: 'Condomínio Morada da Praia (Twitch)',
    creditUrl: '',
    status: 'inactive',
  },
  {
    id: 'guaruja-pitangueiras',
    name: 'Praia das Pitangueiras',
    city: 'Guarujá',
    state: 'SP',
    region: 'Baixada Santista',
    source: 'youtube',
    embedId: '', // verificar se existe stream YouTube equivalente
    description: 'Uma das praias mais movimentadas do Guarujá, vista do Oceano Atlântico',
    credit: 'A confirmar',
    creditUrl: '',
    status: 'inactive',
  },

  // ===== LITORAL NORTE SP =====
  {
    id: 'ubatuba-praia-grande',
    name: 'Praia Grande (Baguari)',
    city: 'Ubatuba',
    state: 'SP',
    region: 'Litoral Norte SP',
    source: 'youtube',
    embedId: '', // verificar canal @ubacam6924 no YouTube
    description: 'Uma das praias mais populares de Ubatuba, lado conhecido como Baguari',
    credit: 'UBACAM',
    creditUrl: 'https://www.youtube.com/@ubacam6924',
    status: 'inactive',
  },

  // ===== RIO DE JANEIRO =====
  {
    id: 'copacabana',
    name: 'Praia de Copacabana',
    city: 'Rio de Janeiro',
    state: 'RJ',
    region: 'Rio de Janeiro',
    source: 'youtube',
    embedId: '', // verificar live atual do canal EarthCam para Copacabana
    description: 'Vista panorâmica da praia mais famosa do Rio, com o Pão de Açúcar ao fundo',
    credit: 'EarthCam',
    creditUrl: 'https://www.earthcam.com/brazil/riodejaneiro/',
    status: 'inactive',
  },
];

export const regions = Array.from(new Set(beachCameras.map((cam) => cam.region)));
