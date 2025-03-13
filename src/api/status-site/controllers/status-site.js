"use strict";

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::status-site.status-site", ({ strapi }) => ({
  async update(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    // console.log("🔍 Incoming Update Request for ID:", id);
    // console.log("👤 User:", user ? user.email : "No user");
    // console.log("📦 Request Body:", ctx.request.body);

    if (!user) {
      console.warn("❌ Unauthorized Update Attempt");
      return ctx.unauthorized("You must be logged in to update the status.");
    }

    const { data } = ctx.request.body;

    // Admins can update everything
    if (user.role.type === "admin") {
      try {
        const updatedStatus = await strapi.entityService.update("api::status-site.status-site", id, { data });
        console.log("✅ Admin Update Successful:", updatedStatus);
        return updatedStatus;
      } catch (error) {
        console.error("❌ Error updating status-site:", error);
        return ctx.badRequest("Failed to update status-site.");
      }
    }

    // For non-admins: Only update `activity_status` inside `status_site`
    if (data?.activity_status) {
      try {
        const existingStatusSite = await strapi.entityService.findOne("api::status-site.status-site", id);

        if (!existingStatusSite) {
          return ctx.notFound("Status site entry not found.");
        }

        const updatedStatus = await strapi.entityService.update("api::status-site.status-site", id, {
          data: {
            activity_status: data.activity_status, // Correctly updating `activity_status`
          },
        });

        console.log("✅ Non-Admin Activity Status Update Successful:", updatedStatus);
        return updatedStatus;
      } catch (error) {
        console.error("❌ Error updating activity status:", error);
        return ctx.badRequest("Failed to update activity status.");
      }
    }

    console.warn("⚠️ Unauthorized Field Modification Attempt");
    return ctx.unauthorized("Only Admins can update other status details.");
  },
}));
