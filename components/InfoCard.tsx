interface InfoCardProps {
  title: string;
  time: string;
  value: string;
  type: 'high' | 'low' | 'current';
}

export default function InfoCard({ title, time, value, type }: InfoCardProps) {
  const getStyles = () => {
    switch (type) {
      case 'high':
        return {
          bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )
        };
      case 'low':
        return {
          bg: 'bg-gradient-to-br from-orange-400 to-orange-500',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )
        };
      case 'current':
        return {
          bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`${styles.bg} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        {styles.icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{time}</span>
      </div>
      <p className="mt-2 text-lg font-semibold opacity-95">{value}</p>
    </div>
  );
}
