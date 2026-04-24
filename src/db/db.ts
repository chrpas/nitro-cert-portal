import Dexie, { type EntityTable } from 'dexie';

export interface WikiArticle {
  id: string; // The article name/title
  title: string;
  content: string;
}

export interface Question {
  id: number;
  type: 'single' | 'multiple' | 'boolean';
  text: string;
  options: string[];
  correctAnswer: number | number[];
  explanation: string;
}

export interface Section {
  title: string;
  items: string[];
}

export interface Module {
  id: string;
  title: string;
  sections: Section[];
  examQuestions?: Question[];
  order?: number;
}

const db = new Dexie('NitroCertification') as Dexie & {
  articles: EntityTable<WikiArticle, 'id'>;
  modules: EntityTable<Module, 'id'>;
};

// Schema declaration:
db.version(2).stores({
  articles: 'id, title',
  modules: 'id, title'
});

db.version(3).stores({
  modules: 'id, title, order'
});

db.version(4).stores({
  modules: 'id, title, order'
});

db.version(5).stores({
  modules: 'id, title, order'
});

db.version(6).stores({
  modules: 'id, title, order'
});

db.version(7).stores({
  modules: 'id, title, order'
}).upgrade(tx => {
  return tx.table('modules').clear(); // Clear to force re-seed of the massive 400 question bank
});

export { db };
