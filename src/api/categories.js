import { request } from "@/api/client";

export const getCategories = () => request("/categories");
