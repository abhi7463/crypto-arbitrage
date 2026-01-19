import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap, Clock, TrendingUp } from 'lucide-react';

export default function ArbitrageDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const cryptoCategories = {
    all: 'All Markets',
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    altcoins: 'Altcoins',
    defi: 'DeFi',
    nft: 'NFT',
    layer2: 'Layer 2'
  };

  const generateMockOpportunities = () => {
    const events = {
      bitcoin: [
        'Bitcoin reaches $100k',
        'Bitcoin dominance > 50%',
        'Bitcoin halving date',
        'BTC price above $80k'
      ],
      ethereum: [
        'Ethereum hits $5k',
        'ETH merge approved',
        'Ethereum staking hits 25M ETH',
        'ETH gas fees below 20 Gwei'
      ],
      altcoins: [
        'Solana hits $200',
        'XRP reaches $3',
        'Cardano hits $2',
        'Polkadot breaks $50'
      ],
      defi: [
        'Total TVL hits $100B',
        'Aave governance vote passes',
        'Uniswap V4 launch',
        'DeFi yield above 10%'
      ],
      nft: [
        'NFT trading volume $10B',
        'Blue-chip NFT floor up 50%',
        'Ordinals inscription 1M',
        'NFT market recovery'
      ],
      layer2: [
        'Arbitrum hits 1M daily users',
        'Optimism transaction volume up',
        'zkSync TVL grows',
        'Polygon fee optimization'
      ]
    };

    let allEvents = [];
    for (const category in events) {
      allEvents = allEvents.concat(
        events[category].map(event => ({
          event,
          category
        }))
      );
    }

    return allEvents.map((item, idx) => {
      const polyYes = (Math.random() * 0.4 + 0.3).toFixed(4);
      const polyNo = (1 - parseFloat(polyYes) + (Math.random() - 0.5) * 0.12).toFixed(4);
      const opinionYes = (parseFloat(polyYes) + (Math.random() - 0.5) * 0.08).toFixed(4);
      const opinionNo = (parseFloat(polyNo) + (Math.random() - 0.5) * 0.08).toFixed(4);

      const polyTotal = (parseFloat(polyYes) + parseFloat(polyNo)).toFixed(4);
      const opinionTotal = (parseFloat(opinionYes) + parseFloat(opinionNo)).toFixed(4);

      const profitPolyFirst = ((1 / parseFloat(polyTotal) - 1) * 100).toFixed(2);
      const profitOpinionFirst = ((1 / parseFloat(opinionTotal) - 1) * 100).toFixed(2);
      const maxProfit = Math.max(parseFloat(profitPolyFirst), parseFloat(profitOpinionFirst));

      if (maxProfit > 0.3) {
        return {
          id: idx,
          event: item.event,
          category: item.category,
          polyYes,
          polyNo,
          polyTotal,
          opinionYes,
          opinionNo,
          opinionTotal,
          maxProfit,
          profitType: parseFloat(profitPolyFirst) > parseFloat(profitOpinionFirst) ? 'poly_first' : 'opinion_first',
          timestamp: new Date()
        };
      }
      return null;
    }).filter(opp => opp !== null);
  };

  const fetchOpportunities = () => {
    setLoading(true);
    setTimeout(() => {
      const data = generateMockOpportunities();
      setOpportunities(data);
      const total = data.reduce((sum, opp) => sum + opp.maxProfit, 0);
      setTotalValue(total);
      setLastUpdated(new Date());
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchOpportunities();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredOpportunities = selectedCategory === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.category === selectedCategory);

  const categoryTotal = filteredOpportunities.reduce((sum, opp) => sum + opp.maxProfit, 0);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full"></div>
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-400">Live Trading</span>
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-3 tracking-tight">CRYPTO ARBITRAGE</h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg">Real-time cross-platform opportunities</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
          <div className="border border-gray-800 bg-gray-950 p-4 sm:p-5 md:p-6">
            <p className="text-gray-600 text-xs sm:text-sm font-mono uppercase tracking-wider mb-2">Opportunities</p>
            <p className="text-3xl sm:text-4xl md:text-4xl font-black">{filteredOpportunities.length}</p>
          </div>
          <div className="border border-gray-800 bg-gray-950 p-4 sm:p-5 md:p-6">
            <p className="text-gray-600 text-xs sm:text-sm font-mono uppercase tracking-wider mb-2">Avg Profit</p>
            <p className="text-3xl sm:text-4xl md:text-4xl font-black">{filteredOpportunities.length > 0 ? (categoryTotal / filteredOpportunities.length).toFixed(2) : '0'}%</p>
          </div>
          <div className="border border-gray-800 bg-gray-950 p-4 sm:p-5 md:p-6">
            <p className="text-gray-600 text-xs sm:text-sm font-mono uppercase tracking-wider mb-2">Total Profit</p>
            <p className="text-3xl sm:text-4xl md:text-4xl font-black">{categoryTotal.toFixed(1)}%</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <p className="text-gray-600 text-xs sm:text-sm font-mono uppercase tracking-wider mb-3 sm:mb-4">Filter by category</p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {Object.entries(cryptoCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-black uppercase tracking-widest transition-all border ${
                  selectedCategory === key
                    ? 'border-white bg-white text-black'
                    : 'border-gray-800 bg-gray-950 text-white hover:border-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 pb-6 sm:pb-8 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 accent-white"
              />
              <span className="text-xs sm:text-sm font-mono text-gray-400">AUTO REFRESH</span>
            </label>
            {lastUpdated && (
              <div className="flex items-center gap-2 text-gray-600 text-xs font-mono">
                <Clock size={14} />
                {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
          <button
            onClick={fetchOpportunities}
            disabled={loading}
            className="w-full sm:w-auto border border-white text-white px-4 sm:px-6 py-2 sm:py-3 font-black text-xs sm:text-sm hover:bg-white hover:text-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            REFRESH
          </button>
        </div>

        {/* Opportunities Grid */}
        <div className="space-y-3 sm:space-y-4">
          {filteredOpportunities.length === 0 ? (
            <div className="border border-gray-800 bg-gray-950 p-8 sm:p-12 md:p-16 text-center">
              <Zap className="inline mb-4 text-gray-700" size={32} />
              <p className="text-gray-600 font-mono text-sm sm:text-base">No opportunities available</p>
            </div>
          ) : (
            filteredOpportunities
              .sort((a, b) => b.maxProfit - a.maxProfit)
              .map(opp => (
                <div 
                  key={opp.id} 
                  className="border border-gray-800 bg-gray-950 hover:border-white transition-all cursor-pointer group"
                >
                  <div className="p-4 sm:p-5 md:p-6">
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-800">
                      <div className="flex-1 w-full">
                        <div className="flex items-start gap-2 sm:gap-3 mb-2">
                          <h3 className="font-black text-lg sm:text-xl group-hover:text-gray-300 transition flex-1">{opp.event}</h3>
                          <span className="text-xs font-mono bg-gray-800 px-2 sm:px-3 py-1 whitespace-nowrap uppercase tracking-wider text-gray-300 mt-0.5">
                            {cryptoCategories[opp.category]}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs font-mono">Market #{opp.id}</p>
                      </div>
                      <div className="text-right w-full sm:w-auto">
                        <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1">{opp.maxProfit.toFixed(2)}</div>
                        <div className="text-gray-600 text-xs font-mono">PROFIT %</div>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      {/* Left Side */}
                      <div>
                        <p className="text-gray-600 text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">Polymarket</p>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs sm:text-sm">YES</span>
                            <span className="font-black text-base sm:text-lg">${opp.polyYes}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs sm:text-sm">NO</span>
                            <span className="font-black text-base sm:text-lg">${opp.polyNo}</span>
                          </div>
                          <div className="border-t border-gray-800 pt-2 sm:pt-3 flex justify-between items-center">
                            <span className="font-mono text-xs text-gray-600">TOTAL</span>
                            <span className="font-black text-sm sm:text-base">${opp.polyTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div>
                        <p className="text-gray-600 text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">Opinion Labs</p>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs sm:text-sm">YES</span>
                            <span className="font-black text-base sm:text-lg">${opp.opinionYes}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs sm:text-sm">NO</span>
                            <span className="font-black text-base sm:text-lg">${opp.opinionNo}</span>
                          </div>
                          <div className="border-t border-gray-800 pt-2 sm:pt-3 flex justify-between items-center">
                            <span className="font-mono text-xs text-gray-600">TOTAL</span>
                            <span className="font-black text-sm sm:text-base">${opp.opinionTotal}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strategy */}
                    <div className="bg-black border border-gray-800 p-3 sm:p-4">
                      <p className="text-gray-600 text-xs font-mono uppercase tracking-wider mb-2">Strategy</p>
                      <p className="font-mono text-xs sm:text-sm">
                        {opp.profitType === 'poly_first' 
                          ? `BUY BOTH ON POLYMARKET → SELL ON OPINION LABS`
                          : `BUY BOTH ON OPINION LABS → SELL ON POLYMARKET`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800">
          <p className="text-gray-700 text-xs font-mono">
            ◆ Showing only profitable crypto arbitrage opportunities with minimum 0.3% returns
          </p>
        </div>
      </div>
    </div>
  );
      }
