// src/api/auth/controllers/customAuth.js
module.exports = {
    async register(ctx) {
      const { email, password, roleType } = ctx.request.body;
  
      // Find role by type
      const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { name: roleType } });
      if (!role) {
        return ctx.badRequest("Invalid role");
      }
  
      // Create user with selected role
      const newUser = await strapi.plugins['users-permissions'].services.user.add({
        email,
        password,
        role: role.id
      });
  
      // Return user data
      ctx.send(newUser);
    }
  };
  