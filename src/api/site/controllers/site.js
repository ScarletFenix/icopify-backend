"use strict";

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::site.site", ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in to create a site.");
      }

      if (!data || !data.siteName) {
        return ctx.badRequest("Invalid site data.");
      }

      data.owner = user.id;

      const newSite = await strapi.entityService.create("api::site.site", {
        data,
      });

      console.log("🔹 New site created:", newSite.id);

      const existingStatus = await strapi.db
        .query("api::status-site.status-site")
        .findOne({
          where: { site: newSite.id },
        });

      if (!existingStatus) {
        await strapi.entityService.create("api::status-site.status-site", {
          data: {
            site: newSite.id,
            website_status: "Pending",
            performer_status: "In Moderation",
            activity_status: "Active",
            website_role: "Contributor",
          },
        });

        console.log("✅ Status site created for site:", newSite.id);
      } else {
        console.warn("⚠️ Status site already exists for site:", newSite.id);
      }

      return ctx.send({
        message: "Site created successfully",
        site: newSite,
      });
    } catch (error) {
      console.error("❌ Error creating site:", error);
      return ctx.throw(500, `Internal Server Error: ${error.message}`);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;

      if (!id) {
        return ctx.badRequest("Missing site ID.");
      }

      const site = await strapi.entityService.findOne("api::site.site", id, {
        populate: ["status_site", "owner"],
      });

      if (!site) {
        return ctx.notFound("Site not found.");
      }

      return ctx.send(site);
    } catch (error) {
      console.error("❌ Error fetching site:", error);
      return ctx.throw(500, `Internal Server Error: ${error.message}`);
    }
  },

  async update(ctx) {
    try {
        const { id } = ctx.params;

        // Fetch the logged-in user with their role
        const user = await strapi.entityService.findOne("plugin::users-permissions.user", ctx.state.user.id, {
            populate: ["role"],
        });

        console.log("Logged-in user:", user);

        if (!user) {
            console.warn("❌ Unauthorized Update Attempt");
            return ctx.unauthorized("You must be logged in to update a site.");
        }

        if (!id) {
            return ctx.badRequest("Missing site ID.");
        }

        // Fetch the site with its owner and status
        const site = await strapi.entityService.findOne("api::site.site", id, {
            populate: ["owner", "status_site"],
        });

        console.log("Fetched site:", site);

        if (!site) {
            return ctx.notFound("Site not found.");
        }

        const { data } = ctx.request.body;

        // Check if the user is an admin
        const isAdmin = user.role.type.toLowerCase() === "admin";
        console.log("Is admin:", isAdmin);

        if (!isAdmin && site.owner?.id !== user.id) {
            console.warn("⚠️ Unauthorized Update Attempt by Non-Owner");
            return ctx.unauthorized("You can only update your own sites.");
        }

        // Remove restricted fields from the update payload
        const allowedFields = { ...data };
        delete allowedFields.contentPlacementPrice;
        delete allowedFields.contentCreationPlacementPrice;
        delete allowedFields.mobileLanguage;

        // Perform the update
        const updatedSite = await strapi.entityService.update("api::site.site", id, {
            data: allowedFields,
        });

        console.log(isAdmin ? "✅ Admin updated site:" : "✅ Non-admin updated their own site:", id);

        return ctx.send({
            message: "Site updated successfully.",
            site: updatedSite,
        });
    } catch (error) {
        console.error("❌ Error updating site:", error);
        return ctx.throw(500, `Internal Server Error: ${error.message}`);
    }



      
},



async delete(ctx) {
  try {
      const { id } = ctx.params;
      const user = ctx.state.user;
    
      if (!user) {
          console.warn("❌ Unauthorized Delete Attempt");
          return ctx.unauthorized("You must be logged in to delete a site.");
      }

      if (!id) {
          return ctx.badRequest("Missing site ID.");
      }

      const site = await strapi.entityService.findOne("api::site.site", id, {
          populate: ["owner", "status_site"],
      });

      if (!site) {
          return ctx.notFound("Site not found.");
      }

      // 🔹 Admin can delete any site
      if (user.role.type.toLowerCase() === "admin") {
          await strapi.entityService.update("api::site.site", id, {
              data: { isDeleted: true },
          });

          console.log("✅ Admin deleted site:", id);
          return ctx.send({ message: "Site marked as deleted successfully." });
      }

      // 🔹 Non-admin can only delete their own sites
      if (site.owner?.id !== user.id) {
          console.warn("⚠️ Unauthorized Delete Attempt by Non-Owner");
          return ctx.unauthorized("You can only delete your own sites.");
      }

      await strapi.entityService.update("api::site.site", id, {
          data: { isDeleted: true },
      });

      console.log("✅ Non-admin deleted their own site:", id);

      return ctx.send({
          message: "Site marked as deleted successfully.",
      });
  } catch (error) {
      console.error("❌ Error deleting site:", error);
      return ctx.throw(500, `Internal Server Error: ${error.message}`);
  }
},

}));
