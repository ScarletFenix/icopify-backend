"use strict";

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::project.project", ({ strapi }) => ({
    async create(ctx) {
        try {
            const { data } = ctx.request.body;
            const user = ctx.state.user;
    
            if (!user) {
                return ctx.unauthorized("You must be logged in to create a project.");
            }
    
            if (!data || !data.projectName || !data.url) {
                return ctx.badRequest("Invalid project data.");
            }
    
            const newProject = await strapi.entityService.create("api::project.project", {
                data: {
                    ...data,
                    buyer: user.id
                },
            });
    
            return ctx.send({
                message: "Project created successfully",
                project: newProject,
            });
        } catch (error) {
            console.error("❌ Error creating project:", error);
            return ctx.throw(500, `Internal Server Error: ${error.message}`);
        }
    }
    
}));
