module.exports = {
    async refreshToken(ctx) {
        try {
            const { refreshToken } = ctx.request.body;

            // Verify refresh token (You should store refresh tokens in a database)
            const user = await strapi.query("user", "users-permissions").findOne({ refreshToken });

            if (!user) {
                return ctx.badRequest("Invalid refresh token");
            }

            // Generate a new JWT token
            const newJwt = strapi.plugins["users-permissions"].services.jwt.issue({ id: user.id });

            return ctx.send({ jwt: newJwt });
        } catch (err) {
            ctx.badRequest("Could not refresh token");
        }
    }
};
