// utils/fetchTenantImage.js

const FALLBACK_IMAGE =
  "https://www.dropbox.com/scl/fi/mz8c9efiva9frjurxluf9/Placeholder_view_vector.svg.png?rlkey=wj1p7v5hwnl9cbo0srrueutvj&st=lt0qy05i&dl=1";

import BASE_URL from "./config"; // adjust path if needed

export const fetchTenantImage = async (tenantId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/tenant-images/${tenantId}`);
    const json = await res.json();
    return json.data?.imageUrl || FALLBACK_IMAGE;
  } catch (err) {
    // console.error(`Failed to fetch image for tenant ${tenantId}`, err);
    return FALLBACK_IMAGE;
  }
};

export const fetchMenuImage = async (menuId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/images/${menuId}`);
    const json = await res.json();
    return json.data?.imageUrl || FALLBACK_IMAGE;
  } catch (err) {
    // console.error(`Failed to fetch image for menu ${menuId}`, err);
    return FALLBACK_IMAGE;
  }
};
