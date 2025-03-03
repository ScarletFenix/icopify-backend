module.exports = {
    async beforeCreate(event) {
      const { data } = event.params;
  
      if (!data) {
        throw new Error("Event data is undefined");
      }
  
      if (!data.site) {
        throw new Error("A StatusSite entry must be linked to a Site");
      }
  
      if (!data.website_role) {
        data.website_role = "Contributor"; // Set default role
      }
    }
  };
  