export interface Scholar {
    _id: string;
    name: string;
    axieId: string;
    share: {
      manager: number;
      scholar: number;
    };
    winrate?: number;
    slp?: number;
    axs?: number;
    createdAt?: string;
  }
  
  export interface BattleLog {
    uuid: string;
    gameMode: string;
    players: Array<{
      userID: string;
      rank: string;
      tier: number;
      elo: number;
      vstar: number;
      team: {
        id: number;
        name: string;
        fighters: Array<{
          axieID: number;
          axieType: string;
          name?: string;
          position: number;
        }>;
        remainPercentTotalHp: number;
      };
      topRank: number | null;
      totalCardPlayed: number;
    }>;
    startedAt: string;
    endedAt: string;
    winner: number;
    turnEndAt: number;
    rewardMeta: {
      rewards: Array<{
        userId: string;
        oldVstar: number | null;
        newVstar: number | null;
        oldElo: number | null;
        newElo: number | null;
        result: string;
        items: Array<{
          itemID: string;
          quantity: number;
        }>;
      }>;
    };
  }
  
  