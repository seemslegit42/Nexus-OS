# Nexis

Nexis is a comprehensive web application built with the Next.js framework, leveraging a modern technology stack to deliver a robust and feature-rich user experience. This project integrates AI capabilities using Genkit, a powerful new framework for building AI-powered applications, and connects to a PostgreSQL database with the Drizzle ORM for efficient data management. Firebase is also utilized for features like Firestore and Cloud Functions.

## Key Technologies

- **Framework:** [Next.js](https://nextjs.org/) (with Turbopack)
- **AI:** [Genkit](https://firebase.google.com/docs/genkit) with [Google AI](https://ai.google/) (Gemini 2.0 Flash)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Backend Services:** [Firebase](https://firebase.google.com/) (Firestore, Cloud Functions)
- **UI:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **Deployment:** [Vercel](https://vercel.com/) (recommended)

## Getting Started

To get the project up and running locally, you'll need to have Node.js and pnpm installed.

1.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

2.  **Set Up Environment Variables:**

    Create a `.env` file in the root of the project and add the necessary environment variables, including your `DATABASE_URL` and any required Firebase and Google AI API keys.

3.  **Run the Development Servers:**

    This project has two main development processes that should be run concurrently in separate terminals:

    -   **Next.js Application:**

        ```bash
        pnpm dev
        ```

        This will start the Next.js development server with Turbopack, available at `http://localhost:3000`.

    -   **Genkit AI Flows:**

        ```bash
        pnpm genkit:watch
        ```

        This will start the Genkit development server, which watches for changes in your AI flows. The Genkit UI will be available at `http://localhost:4000`.

## Database

This project uses Drizzle ORM to manage the PostgreSQL database schema and queries.

-   **Generate Migrations:**

    When you make changes to the database schema in `src/lib/db/schema.ts`, you'll need to generate a new migration file:

    ```bash
    pnpm db:generate
    ```

-   **Apply Migrations:**

    To apply the generated migrations to your database, run:

    ```bash
    pnpm db:migrate
    ```

-   **Drizzle Studio:**

    You can use Drizzle Studio to browse and manage your database:

    ```bash
    pnpm db:studio
    ```

## AI Flows

The AI capabilities of this application are powered by Genkit and are defined in the `src/ai/flows` directory. The following flows are currently implemented:

-   `generate-prompt-variations.ts`
-   `explain-security-vulnerability.ts`
-   `suggest-agent-task.ts`
-   `suggest-module-improvements.ts`
-   `summarize-logs.ts`
-   `generate-lead-insight.ts`

These flows can be inspected and tested from the Genkit UI.

## Deployment

The easiest way to deploy this Next.js application is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

For the backend services, you can deploy the Firestore rules and Cloud Functions using the Firebase CLI.

```bash
firebase deploy
```
Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) and the [Firebase deployment documentation](https://firebase.google.com/docs/cli/deploy) for more details.
