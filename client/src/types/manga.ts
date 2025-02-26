export interface IStatusChange {
  status: string;
  timestamp: string;
}

export interface IManga {
  _id: string;
  userId: string;
  malId: number;
  title: string;
  description: string;
  coverImage: string;
  status: 'Reading' | 'To Be Read' | 'Read';
  ownership: 'Owned' | 'Not Owned';
  addedAt: string;
  statusHistory: IStatusChange[];
}
