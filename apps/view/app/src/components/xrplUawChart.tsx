import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { UawDetailModal } from './UawDetailModal';
import API from "../api/frontendAPI";

interface AppData {
  serviceName: string;
  uawData: number[];
}

interface UawData {
  data: AppData[];
}

export const ChartSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uawData, setUawData] = useState<UawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUawData = async () => {
      try {
        setLoading(true);
        const data = await API.xrplUAW();
        setUawData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch UAW data:', err);
        setError('Failed to load UAW data');
      } finally {
        setLoading(false);
      }
    };

    fetchUawData();
  }, []);

  // Calculate total UAW for each time period by summing all apps
  const calculateTotalUAW = () => {
    if (!uawData || !uawData.data || uawData.data.length === 0) return [];
    
    const apps = uawData.data;
    const maxLength = Math.max(...apps.map(app => app.uawData.length));
    
    const totalUAW = [];
    for (let i = 0; i < maxLength; i++) {
      let sum = 0;
      for (const app of apps) {
        if (i < app.uawData.length) {
          sum += app.uawData[i];
        }
      }
      totalUAW.push(sum);
    }
    
    // Reverse the array so index 0 (latest) appears on the right side of the chart
    return totalUAW.reverse();
  };

  // Group data into sets of 2 and calculate average
  const groupedData = [];
  const totalUAW = calculateTotalUAW();

  for (let i = 0; i < totalUAW.length; i += 1) {
    const group = totalUAW.slice(i, i + 1);
    const average = group.reduce((sum, val) => sum + val, 0) / group.length;
    
    const date = new Date();
    date.setHours(date.getHours() - (totalUAW.length - 1 - i));
    
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    
    groupedData.push({
      name: `${month} ${day}, ${hour}:00`,
      value: Math.round(average),
      timestamp: date.toISOString()
    });
  }

  // Calculate the latest UAW and 1h change
  const latestUAW = totalUAW[totalUAW.length - 1] || 0;
  const previousUAW = totalUAW[totalUAW.length - 2] || 0;
  const change1h = latestUAW - previousUAW;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.timestamp);
      const formattedDate = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      return (
        <div className="bg-gray-900/90 backdrop-blur-sm p-3 rounded-lg border border-gray-800 shadow-lg">
          <p className="text-gray-400 text-sm">{formattedDate}</p>
          <p className="text-white font-medium">{(data.value / 1000).toFixed(2)}K UAW</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-44 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 rounded-2xl p-6">
        <div className="text-red-400 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="bg-gray-900/50 hover:bg-gray-900/80 rounded-2xl p-2 pb-0 select-none transition-colors cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-gray-400 text-sm">XRPL Project Total UAW</h3>
            <div className="items-center space-x-2">
              <div className="text-3xl font-bold text-white">{(latestUAW / 1000).toFixed(2)}K</div>
              <div className={`text-sm ${change1h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change1h >= 0 ? '+' : ''}{change1h} (1H)
              </div>
            </div>
          </div>
        </div>

        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={groupedData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="10">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                interval={Math.floor(groupedData.length / 5)}
                hide
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                fill="url(#colorGradient)"
                cursor="pointer"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <UawDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
