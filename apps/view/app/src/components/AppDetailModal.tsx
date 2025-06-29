import { X } from "lucide-react";
import { Project } from "./appList";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip } from 'recharts';
import allNotices from '../mockData/notices.json';

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface AppDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const AppDetailModal = ({ project, onClose }: AppDetailModalProps) => {
  if (!project) return null;

  const getAppIcon = (appName: string) => {
    switch (appName) {
      case 'First_Ledger':
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAWlBMVEUAAAD////39/dMTEzLy8vHx8e5ublZWVn8/PwFBQVmZmYTExPd3d3y8vIICAiAgIDs7Oxvb28+Pj5VVVVsbGx6enpKSkqYmJh9fX3h4eEZGRm1tbW8vLyfn5+4huXXAAACcklEQVR4nO3ca3OiMBSA4SReCNsV3Fp73///N5dAp1YO1440nOz7fKvjML6GEASrMQAAAAAAAAAAAAAAAAAAAAAAAAAAAMB/KV9mq/ky2/2GxV7JegrN/WYJrysq3Hp3e4dN7LBPhdnaBbjH2GFfLFO4njGkkEIK14BCCimMj0IKKYxvpNCP53Q8RVGht96PRnrxHE2Fkz4fqy58Op2yEafStYdZUaE7/hrfRObbc1FRobeHP2bsylnmxBujqNDb42ii7sIwig8pF1aBzh4fhjehutDbL3OxbyBVF34Iif03APQXVgN5GFo01BfWq93QXFRfWJ942oGlX1uhs745vrQ0h5uuyaissBqtg7XiA4X3/YcbZYXW7s9hr2wlhgf65qK6wjdTuo5BtL1zUV3huzHPnWPYnMBJ6gr31aNlMxdFZn2O2p6LKgtDoggMq0bXKOosNGffkVg5PorzU42FYUcsvVwUw0FWDqLGwtqzs11Lvzyeqi2s5qKXq0ZChWFHdfJ4mlBhkygHMZ3C+ohZihefUGEjrIvXu2pqhXLpT67QnJ1NeQzDZGwt/YkV1s5XBQmd01yUvy9eMvHhIoFCc3fxWohr/PoLi+s/xcVv9YX5VVPHpSj1haMojIzCCSiMjMIJKIyMwgkojIzCCdQVvs3dROaUfTdxduFG2/dLX/bv+1l24t7GqgsnfHW9Td7bWHVh933R4UDxvqy78BYo/FEUUkhhfBRSSGF8FFKooHD8v2Bn8ysqzJMfw9z83e5ubru7jx32qSjGn/O9DS+03dnyfKEfpVvN77UBAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+sf3ToqjkrrPH0AAAAASUVORK5CYII=';
      case 'Magnetic':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWD3jBRobLBZbefTa6RvbEVi1cqPRjIWvAZw&s';
      case 'Sologenic':
        return 'https://avatars.githubusercontent.com/u/56408308?s=200&v=4';
      case 'OpulenceX':
        return 'https://pbs.twimg.com/profile_images/1907882095344758786/bkdzef2B_400x400.jpg';
      default:
        return '📊';
    }
  };

  const getDisplayName = (serviceName: string) => {
    switch (serviceName) {
      case 'First_Ledger':
        return 'First Ledger';
      case 'Magnetic':
        return 'Magnetic';
      case 'Sologenic':
        return 'Sologenic';
      case 'OpulenceX':
        return 'OpulenceX';
      default:
        return serviceName;
    }
  };

  // Calculate UAW changes
  const uaw = project.uawData;
  const change1h = uaw.length >= 2 ? ((uaw[0] - uaw[1]) / uaw[0]) * 100 : 0;
  const change1d = uaw.length >= 24 ? ((uaw[0] - uaw[23]) / uaw[0]) * 100 : 0;
  const change7d = uaw.length >= 168 ? ((uaw[0] - uaw[167]) / uaw[0]) * 100 : 0;

  // Prepare chart data
  const chartData = [];
  const reversedUaw = [...uaw].reverse(); // Reverse so latest data is on the right

  for (let i = 0; i < reversedUaw.length; i++) {
    const date = new Date();
    date.setHours(date.getHours() - (reversedUaw.length - 1 - i));
    
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    
    chartData.push({
      name: `${month} ${day}, ${hour}:00`,
      value: reversedUaw[i],
      timestamp: date.toISOString()
    });
  }

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
          <p className="text-white font-medium">{data.value.toLocaleString()} UAW</p>
        </div>
      );
    }
    return null;
  };

  const notices = allNotices;
  console.log(notices["Magnetic"][0]);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl select-none">
                <img src={`${getAppIcon(project.serviceName)}`} alt="" />
              </div>
              <h2 className="text-xl font-bold text-white pointer-default">{getDisplayName(project.serviceName)}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 cursor-default">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm mb-2">Current UAW</h3>
                <p className="text-white text-2xl font-mono">
                  {uaw[0].toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm mb-2">1h Change</h3>
                <p className={`text-2xl ${change1h >= 0 ? (change1h == 0 ? "text-gray-400" : "text-green-400") : "text-red-400"}`}>
                  {change1h >= 0 ? (change1h == 0 ? "" : "+") : ""}{change1h.toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm mb-2">1d Change</h3>
                <p className={`text-2xl ${change1d >= 0 ? (change1d == 0 ? "text-gray-400" : "text-green-400") : "text-red-400"}`}>
                  {change1d >= 0 ? (change1d == 0 ? "" : "+") : ""}{change1d.toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm mb-2">7d Change</h3>
                <p className={`text-2xl ${change7d >= 0 ? (change7d == 0 ? "text-gray-400" : "text-green-400") : "text-red-400"}`}>
                  {change7d >= 0 ? (change7d == 0 ? "" : "+") : ""}{change7d.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* UAW Chart */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-4 select-none">UAW Trend</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
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
                      interval={Math.floor(chartData.length / 5)}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
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

            {/*  LastestNotice */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-2 select-none">Latest Notice</h3>
              <div className="space-y-3 mt-2">
                {notices ? (
                    <div key={notices[project.serviceName].id} className="p-3 bg-gray-900 rounded-md">
                      <p className="font-bold text-white">{project.serviceName}</p>
                      <p className="text-sm text-gray-300 mt-1">{notices[project.serviceName].content.split("\n").map((it,idx) => (
                        <span key={idx}>
                          {it}
                          <br />
                        </span>
                      ))}</p>
                      <p className="text-xs text-gray-500 mt-2">{notices[project.serviceName].date}</p>
                    </div>
                  ) : (
                  <div className="p-3 bg-gray-900 rounded-md text-sm text-gray-300">
                    No notices available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 