declare namespace NodeJS {
  export interface ProcessEnv {
    readonly GOOGLE_ID: string;
    readonly GOOGLE_SECRET: string;
    readonly GITHUB_ID: string;
    readonly GITHUB_SECRET: string;
    readonly NEXT_AUTH_SECRET: string;
    readonly MOVIEDB_API_KEY: string;
    readonly DATABASE_URL: string;
  }
}
