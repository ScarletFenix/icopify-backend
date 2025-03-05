"use strict";

require("@strapi/utils");

module.exports = {
  async getPendingSites(ctx) {
    const adminUser = ctx.state.user;

    // Ensure only the admin can access this API
    if (!adminUser || adminUser.roleType !== "Admin") {
      return ctx.unauthorized("Only admins can access this data.");
    }

    try {
      const pendingSites = await strapi.entityService.findMany("api::site.site", {
        filters: { status: "pending" },
        populate: ["owner"], // Include site owner details
      });

      return pendingSites;
    } catch (error) {
      console.error("Error fetching pending sites:", error);
      return ctx.internalServerError("Something went wrong.");
    }
  },
};
