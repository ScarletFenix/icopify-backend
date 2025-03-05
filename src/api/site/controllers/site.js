"use strict";

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::site.site", ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const user = ctx.state.user; // Get the logged-in user

      if (!user) {
        return ctx.unauthorized("You must be logged in to create a site.");
      }

      if (!data || !data.siteName) {
        return ctx.badRequest("Invalid site data.");
      }

      // ✅ Associate the site with the logged-in user
      data.owner = user.id;

      // ✅ Create the new site
      const newSite = await strapi.entityService.create("api::site.site", {
        data,
      });

      console.log("🔹 New site created:", newSite.id);

      // ✅ Check if a StatusSite already exists for this site
      const existingStatus = await strapi.db
        .query("api::status-site.status-site")
        .findOne({
          where: { site: newSite.id },
        });

      if (!existingStatus) {
        await strapi.entityService.create("api::status-site.status-site", {
          data: {
            site: newSite.id,
            website_status: "Pending", // Default status for approval
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

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user; // Get the logged-in user

      if (!user || user.roleType !== "Admin") {
        return ctx.unauthorized("Only admins can delete sites.");
      }

      if (!id) {
        return ctx.badRequest("Missing site ID.");
      }

      // ✅ Find the site before deleting
      const site = await strapi.entityService.findOne("api::site.site", id, {
        populate: ["status_site"],
      });

      if (!site) {
        return ctx.notFound("Site not found.");
      }

      // ✅ Delete the associated StatusSite entry
      if (site.status_site?.id) {
        await strapi.entityService.delete(
          "api::status-site.status-site",
          site.status_site.id
        );
        console.log("✅ Status site deleted for site:", id);
      }

      // ✅ Delete the site
      await strapi.entityService.delete("api::site.site", id);
      console.log("✅ Site deleted:", id);

      return ctx.send({
        message: "Site and associated status deleted successfully.",
      });
    } catch (error) {
      console.error("❌ Error deleting site:", error);
      return ctx.throw(500, `Internal Server Error: ${error.message}`);
    }
  },
}));
