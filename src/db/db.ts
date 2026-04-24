import Dexie, { type EntityTable } from 'dexie';

export interface WikiArticle {
  id: string; // The article name/title
  title: string;
  content: string;
}

const db = new Dexie('NitroCertification') as Dexie & {
  articles: EntityTable<WikiArticle, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  articles: 'id, title' // primary key and indexed properties
});

export { db };
