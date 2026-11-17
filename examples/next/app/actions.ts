"use server";

export async function saveAction() {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return { savedAt: new Date().toLocaleTimeString("en-US") };
}
