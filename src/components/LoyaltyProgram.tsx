"use client";

import { useState, useEffect } from "react";
import { useTranslations, useI18n } from "@/lib/i18n";
import {
  Star,
  Gift,
  History,
  Award,
  Trophy,
  Crown,
  Medal,
  Coins
} from "lucide-react";

interface LoyaltyStats {
  currentPoints: number;
  totalEarned: number;
  totalSpent: number;
  level: {
    name: string;
    multiplier: number;
    color: string;
  };
  memberSince: string;
  transactionsCount: number;
}

interface LoyaltyReward {
  id: string;
  title: string;
  description: string | null;
  type: string;
  pointsCost: number;
  value: number | null;
  remainingUses: number | null;
}

interface LoyaltyTransaction {
  id: string;
  type: string;
  points: number;
  description: string;
  createdAt: string;
  orderNumber?: string;
  orderAmount?: number;
  rewardTitle?: string;
  rewardType?: string;
}

export default function LoyaltyProgram() {
  const t = useTranslations();
  const { locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history'>('overview');
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  useEffect(() => {
    loadLoyaltyData();
  }, [activeTab]);

  const loadLoyaltyData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'overview' || activeTab === 'rewards') {
        const [statsResponse, rewardsResponse] = await Promise.all([
          fetch('/api/loyalty?action=stats'),
          fetch('/api/loyalty?action=rewards')
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        if (rewardsResponse.ok) {
          const rewardsData = await rewardsResponse.json();
          setRewards(rewardsData.rewards);
        }
      } else if (activeTab === 'history') {
        const response = await fetch('/api/loyalty?action=history');
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions);
        }
      }
    } catch (error) {
      console.error('Failed to load loyalty data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    setIsRedeeming(rewardId);
    try {
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId })
      });

      const data = await response.json();

      if (response.ok) {
        alert(locale === 'en' ? `Congratulations! ${data.message}` : `Поздравляем! ${data.message}`);
        if (stats) {
          setStats({
            ...stats,
            currentPoints: data.remainingPoints
          });
        }
        loadLoyaltyData();
      } else {
        alert(data.error || (locale === 'en' ? 'An error occurred' : 'Произошла ошибка'));
      }
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      alert(locale === 'en' ? 'Error redeeming points' : 'Произошла ошибка при обмене баллов');
    } finally {
      setIsRedeeming(null);
    }
  };

  const getLevelIcon = (levelName: string) => {
    // Level names might come from backend in Russian usually.
    // Ideally backend should return code, but let's handle string match for now.
    if (levelName.includes('Платин') || levelName.includes('Platinum')) return <Crown className="h-6 w-6 text-purple-600" />;
    if (levelName.includes('Золот') || levelName.includes('Gold')) return <Trophy className="h-6 w-6 text-yellow-600" />;
    if (levelName.includes('Серебр') || levelName.includes('Silver')) return <Medal className="h-6 w-6 text-gray-600" />;
    if (levelName.includes('Бронз') || levelName.includes('Bronze')) return <Award className="h-6 w-6 text-orange-600" />;
    return <Star className="h-6 w-6 text-blue-600" />;
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case 'DISCOUNT_PERCENTAGE':
        return <Star className="h-5 w-5 text-green-600" />;
      case 'DISCOUNT_FIXED':
        return <Coins className="h-5 w-5 text-blue-600" />;
      case 'FREE_SHIPPING':
        return <Gift className="h-5 w-5 text-purple-600" />;
      case 'BONUS_POINTS':
        return <Star className="h-5 w-5 text-yellow-600" />;
      default:
        return <Gift className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EARNED':
        return <span className="text-green-600">+</span>;
      case 'SPENT':
        return <span className="text-red-600">-</span>;
      case 'BONUS':
        return <span className="text-blue-600">🎁</span>;
      default:
        return <span className="text-gray-600">•</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-1 h-10 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight font-serif">
              {t('dashboard_loyalty.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-normal">
            {t('dashboard_loyalty.subtitle')}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: (t('dashboard_loyalty.tabs') as any).overview, icon: Star },
              { id: 'rewards', name: (t('dashboard_loyalty.tabs') as any).rewards, icon: Gift },
              { id: 'history', name: (t('dashboard_loyalty.tabs') as any).history, icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Current Balance & Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-accent via-accent-dark to-accent-dark rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">{t('dashboard_loyalty.points_balance')}</p>
                  <p className="text-4xl font-bold mb-1">{stats.currentPoints}</p>
                  <p className="text-white/80 text-sm font-medium">
                    {locale === 'en' ? 'points' : 'баллов'}
                  </p>
                </div>
                <Coins className="h-14 w-14 text-white/80" />
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center gap-4">
                {getLevelIcon(stats.level.name)}
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{t('dashboard_loyalty.level')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.level.name}</p>
                  <p className="text-sm text-gray-600 font-normal">
                    {locale === 'en' ? 'Multiplier' : 'Множитель'}: {stats.level.multiplier}x
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-premium p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{t('dashboard_loyalty.total_earned')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEarned}</p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Gift className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{t('dashboard_loyalty.total_spent')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSpent}</p>
                </div>
              </div>
            </div>

            <div className="card-premium p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <History className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{t('dashboard_loyalty.total_operations')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.transactionsCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="panel p-8 bg-blue-50/50">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h3 className="text-xl font-semibold text-gray-900">{t('dashboard_loyalty.rules_title')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  {locale === 'en' ? 'For purchases:' : 'За покупки:'}
                </h4>
                <ul className="text-sm text-gray-600 space-y-2 font-normal">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{locale === 'en' ? '1 point for every 1 BYN spent' : '1 балл за каждый потраченный рубль'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{locale === 'en' ? 'Double points for first order' : 'Двойные баллы за первый заказ'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{locale === 'en' ? 'Triple points on birthday' : 'Тройные баллы в день рождения'}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  {locale === 'en' ? 'Loyalty levels:' : 'Уровни лояльности:'}
                </h4>
                <ul className="text-sm text-gray-600 space-y-2 font-normal">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{locale === 'en' ? 'Newbie: 1x points' : 'Новичок: 1x баллов'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{locale === 'en' ? 'Bronze (100+): 1.1x points' : 'Бронзовый (100+): 1.1x баллов'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{locale === 'en' ? 'Silver (1000+): 1.2x points' : 'Серебряный (1000+): 1.2x баллов'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{locale === 'en' ? 'Gold (2500+): 1.3x points' : 'Золотой (2500+): 1.3x баллов'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{locale === 'en' ? 'Platinum (5000+): 1.5x points' : 'Платиновый (5000+): 1.5x баллов'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="card-premium p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getRewardTypeIcon(reward.type)}
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {reward.pointsCost} {locale === 'en' ? 'points' : 'баллов'}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {reward.title}
              </h3>

              {reward.description && (
                <p className="text-sm text-gray-600 mb-4 font-normal">
                  {reward.description}
                </p>
              )}

              {reward.value && (
                <div className="text-sm text-accent font-semibold mb-4">
                  {reward.type === 'DISCOUNT_PERCENTAGE'
                    ? `${locale === 'en' ? 'Discount' : 'Скидка'} ${reward.value}%`
                    : reward.type === 'DISCOUNT_FIXED'
                    ? `${locale === 'en' ? 'Discount' : 'Скидка'} ${reward.value} BYN`
                    : reward.type === 'BONUS_POINTS'
                    ? `+${reward.value} ${locale === 'en' ? 'points' : 'баллов'}`
                    : `${reward.value}`
                  }
                </div>
              )}

              {reward.remainingUses && (
                <div className="text-xs text-gray-500 mb-4 font-medium">
                  {locale === 'en' ? 'Remaining: ' : 'Осталось: '}{reward.remainingUses}
                </div>
              )}

              <button
                onClick={() => handleRedeemReward(reward.id)}
                disabled={isRedeeming === reward.id || (stats?.currentPoints || 0) < reward.pointsCost}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRedeeming === reward.id ? (locale === 'en' ? 'Redeeming...' : 'Обмен...') : (locale === 'en' ? 'Redeem' : 'Обменять')}
              </button>
            </div>
          ))}
          {rewards.length === 0 && (
             <p className="text-center col-span-3 text-gray-500">{t('dashboard_loyalty.no_rewards')}</p>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="card-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="inline-flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-accent to-accent-gold rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-900">{t('dashboard_loyalty.history_title')}</h2>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <History className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('dashboard_loyalty.no_history')}</h3>
              <p className="text-gray-600 font-normal">
                {locale === 'en' ? 'Your points history will appear here' : 'Здесь появится история ваших операций с баллами'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-xl">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 font-normal mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ru-RU')}
                          {transaction.orderNumber && ` • ${locale === 'en' ? 'Order' : 'Заказ'} ${transaction.orderNumber}`}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points} {locale === 'en' ? 'points' : 'баллов'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
