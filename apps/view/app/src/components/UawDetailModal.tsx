import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import API from '../api/frontendAPI';

interface UawDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AppData {
  serviceName: string;
  uawData: number[];
}

interface UawData {
  data: AppData[];
}

export const UawDetailModal = ({ isOpen, onClose }: UawDetailModalProps) => {
  const [uawData, setUawData] = useState<UawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

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

  // Transform the data array into the format required by recharts
  const chartData = calculateTotalUAW().map((value, index) => {
    const date = new Date();
    date.setHours(date.getHours() - (calculateTotalUAW().length - 1 - index));
    
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    
    return {
      name: `${month} ${day}, ${hour}:00`,
      value: value,
      timestamp: date
    };
  });

  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string, props: any) => {
    const date = props.payload.timestamp;
    return [`${value} UAW`];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-6 w-[90vw] max-w-4xl select-none"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">XRPL Project Total UAW</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="h-[60vh] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="h-[60vh] flex items-center justify-center">
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
          ) : (
            <div className="h-[60vh]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={{ stroke: '#4b5563' }}
                    tickLine={{ stroke: '#4b5563' }}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    interval={23}
                  />
                  <YAxis 
                    axisLine={{ stroke: '#4b5563' }}
                    tickLine={{ stroke: '#4b5563' }}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                    formatter={formatTooltip}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fill="url(#colorGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 