module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Normalize the URL: Remove trailing slashes and convert to lowercase
    if (data.url) {
      data.url = data.url.trim().replace(/\/+$/, '').toLowerCase();
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    // Normalize the URL: Remove trailing slashes and convert to lowercase
    if (data.url) {
      data.url = data.url.trim().replace(/\/+$/, '').toLowerCase();
    }
  },

  async afterCreate(event) {
    const { result } = event;

    try {
      // Check if a StatusSite already exists for this site
      const existingStatus = await strapi.entityService.findMany(
        "api::status-site.status-site",
        { filters: { site: result.id } }
      );

      // Create StatusSite ONLY if it does not exist
      if (!existingStatus.length) {
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
    } catch (error) {
      strapi.log.error(`Error creating StatusSite for site ID ${result.id}:`, error);
    }
  },
};
