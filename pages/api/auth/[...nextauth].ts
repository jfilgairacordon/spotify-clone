import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

const refreshAccessToken = async (token: JWT | any) =>
{
    try
    {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("REFRESHED TOKEN IS", refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }

    }
    catch (error)
    {
        console.error(error);
        return {
            ...token,
            error: 'RefreshAccesssTokenError'
        }
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXTAUTH_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXTAUTH_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt(params)
        {
            const { token, account, user } = params;
            // initial sign in
            if (account && user)
            {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accesTokenExpires: (account.expires_at || 1) * 1000
                }
            }

            // Return previous token if the access token has not expired
            if (Date.now() < (token as any).accessTokenExpires)
            {
                console.log("EXISTING ACCESS TOKEN IS VALID");
                return token;
            }

            // Access token has expired, so we need to refresh it...
            console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...');
            return await refreshAccessToken(token);
        },
        async session(params)
        {
            const { session, token } = params;
            session.user!.accessToken = token.accessToken;
            session.user!.refreshToken = token.refreshToken;
            session.user!.username = token.username;

            return session;
        }
    }
})