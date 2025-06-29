import { useState, useEffect } from "react";
import { AppDetailModal } from "./AppDetailModal";
import API from "../api/frontendAPI";
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export interface Project {
  name: string;
  serviceName: string;
  uawData: number[];
}

// Small chart component for the table
const SmallUawChart = ({ uawData }: { uawData: number[] }) => {
  // Prepare chart data for the last 24 hours (or available data)
  const chartData = [];
  const dataPoints = Math.min(uawData.length, 168);
  const recentData = uawData.slice(0, dataPoints).reverse();

  for (let i = 0; i < recentData.length; i = i + 5) {
    chartData.push({
      value: recentData[i]
    });
  }

  return (
    <div className="w-16 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="smallGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={1}
            fill="url(#smallGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProjectTable = () => {
  const [sortKey, setSortKey] = useState<'name' | 'uaw' | 'reviews'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppsData = async () => {
      try {
        setLoading(true);
        const data = await API.applist();
        setProjects(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch apps data:', err);
        setError('Failed to load apps data');
      } finally {
        setLoading(false);
      }
    };

    fetchAppsData();
  }, []);

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

  const getReviewValue = (project: Project) => {
    const uaw = project.uawData;
    let change1h: number = uaw.length >= 2 ? (uaw[0] - uaw[1])/uaw[0] : 0;
    let change24h: number = uaw.length >= 24 ? (uaw[0] - uaw[23])/uaw[0] : 0;
    let change7d: number = uaw.length >= 168 ? (uaw[0] - uaw[167])/uaw[0] : 0;
    if (change1h > 0 && change24h > 0 && change7d > 0) return 2; // POSITIVE
    if (change1h < 0 && change24h < 0 && change7d < 0) return 0; // NEGATIVE
    return 1; // MIXED
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const isAsc = sortDirection === 'asc';
    if (sortKey === 'name') {
      return isAsc ? a.serviceName.localeCompare(b.serviceName) : b.serviceName.localeCompare(a.serviceName);
    } else if (sortKey === 'uaw') {
      return !isAsc ? a.uawData[0] - b.uawData[0] : b.uawData[0] - a.uawData[0];
    } else { // reviews
      const reviewA = getReviewValue(b);
      const reviewB = getReviewValue(a);
      return isAsc ? reviewA - reviewB : reviewB - reviewA;
    }
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const pagedProjects = sortedProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden select-none">
        <div className="p-6 border-b border-gray-800">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden select-none">
        <div className="p-6 text-center">
          <div className="text-red-400">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden select-none">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <select
                id="sort-key-select"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as 'name' | 'uaw' | 'reviews')}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="name">Name</option>
                <option value="uaw">UAW</option>
                <option value="reviews">Reviews</option>
              </select>
              <button
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg text-sm transition-colors"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? 'Ascending ▲' : 'Descending ▼'}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 no-wrap">
                <th className="text-left p-4 text-gray-400 text-sm font-medium text-center">#</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium text-center">Application</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium text-center">UAW (User Active Wallet)</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium text-center">1h</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium text-center">1d</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium text-center">7d</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium text-center">1h UAW</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium text-center">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {pagedProjects.map((project, idx) => {
                const uaw = project.uawData;
                const change24h = uaw[1]!==0 ? ((uaw[0] - uaw[1]) / uaw[1]) * 100 : 0;
                const change1d = uaw[24]!==0 ? ((uaw[0] - uaw[23]) / uaw[23]) * 100 : 0;
                const change7d = uaw[167]!==0 ? ((uaw[0] - uaw[167]) / uaw[167]) * 100 : 0;
                
                return (
                  <tr 
                    key={idx + 1}
                    className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedProject(project as Project)}
                  >
                    <td className="p-4 text-gray-300 text-center">{(page - 1) * itemsPerPage + idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                          <img src={`${getAppIcon(project.serviceName)}`} alt="" className='rounded-lg' />
                        </div>
                        <span className="text-white font-medium">{getDisplayName(project.serviceName)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white font-mono text-center">{uaw[0].toLocaleString()}</td>
                    <td className="p-4">
                      <span className={change24h >= 0 ? (change24h == 0 ? "text-gray-400" : "text-green-400") : "text-red-400"}>
                        {change24h >= 0 ? (change24h == 0 ? "" : "+") : ""}{change24h.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={change1d >= 0 ? (change1d == 0 ? "text-gray-400" : "text-green-400") : "text-red-400"}>
                        {change1d >= 0 ? "+" : ""}{change1d.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={change7d >= 0 ? (change7d == 0 ? "text-gray-400" : "text-green-400") : "text-red-400"}>
                        {change7d >= 0 ? "+" : ""}{change7d.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-4">
                      <SmallUawChart uawData={uaw} />
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${change24h > 0 && change7d > 0 && change1d > 0 ? 'bg-green-900 text-green-300' : 
                          change24h < 0 && change7d < 0 && change1d < 0 ? 'bg-red-900 text-red-300' : 
                          'bg-yellow-900 text-yellow-300'}
                      `}>
                        {change24h > 0 && change7d > 0 && change1d > 0 ? 'POSITIVE' : 
                          change24h < 0 && change7d < 0 && change1d < 0 ? 'NEGATIVE' : 
                          'MIXED'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center p-4 gap-2">
          <button
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-40"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-gray-300">{page} / {totalPages}</span>
          <button
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-40"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <AppDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};