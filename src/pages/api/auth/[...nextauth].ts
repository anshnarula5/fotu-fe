import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                url: "https://accounts.google.com/o/oauth2/v2/auth",
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/userinfo.profile",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if(user){
                token.id = user.id;
            }
            try {
                const response = await fetch("http://localhost:8080/auth/save-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: token.email,
                        name: token.name,
                        image: token.image,
                        googleId: token.id,
                    }),
                });

                const data = await response.json();
                if (data.success && data.user) {
                    token.dailyAnalysisRemaining = data.user.dailyAnalysisRemaining; // Store in token
                }
            } catch (error) {
                console.error("Error saving user:", error);
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.accessToken = token.accessToken;
            session.user.dailyAnalysisRemaining = token.dailyAnalysisRemaining ?? null; // Store in session
            return session;
        },
    },
});
