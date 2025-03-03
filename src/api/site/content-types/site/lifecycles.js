module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Check if StatusSite already exists for this site
    const existingStatus = await strapi.entityService.findMany("api::status-site.status-site", {
      filters: { site: result.id },
    });

    if (existingStatus.length === 0) {
      // Create StatusSite ONLY if it does not exist
      await strapi.entityService.create("api::status-site.status-site", {
        data: {
          site: result.id,
          website_status: "Pending",
          performer_status: "In Moderation",
          activity_status: "Inactive",
          website_role: "Contributor",
        },
      });
    }
  }
};
