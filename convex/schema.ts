import {defineSchema,defineTable} from 'convex/server';import {v} from 'convex/values';
export default defineSchema({
 properties:defineTable({title:v.string(),slug:v.string(),location:v.string(),price:v.number(),type:v.string(),beds:v.number(),baths:v.number(),area:v.number(),image:v.optional(v.string()),status:v.string()}).index('by_slug',['slug']).index('by_status',['status']),
 leads:defineTable({name:v.string(),phone:v.string(),email:v.optional(v.string()),source:v.string(),message:v.optional(v.string()),status:v.string(),createdAt:v.number()}).index('by_status',['status']),
 siteVisits:defineTable({propertyId:v.id('properties'),name:v.string(),phone:v.string(),preferredDate:v.string(),status:v.string(),createdAt:v.number()}),
 consultations:defineTable({name:v.string(),phone:v.string(),email:v.optional(v.string()),service:v.string(),message:v.optional(v.string()),status:v.string(),createdAt:v.number()}),
 courses:defineTable({title:v.string(),slug:v.string(),category:v.string(),duration:v.string(),level:v.string(),image:v.optional(v.string()),status:v.string()}).index('by_slug',['slug']),
 events:defineTable({title:v.string(),slug:v.string(),date:v.string(),place:v.string(),description:v.string(),image:v.optional(v.string()),status:v.string()}).index('by_slug',['slug'])
});
