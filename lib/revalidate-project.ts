import { revalidatePath } from "next/cache";

/*
 * Cualquier cambio en un proyecto (info, imágenes,
 * modelo BIM, avance de obra) puede afectar tres lugares
 * públicos a la vez: la home (carrusel de proyectos y
 * Astrocasas), /proyectos (grilla completa, con las
 * insignias 3D/5D) y la página del modelo. Revalidar
 * solo /modelos/[slug], como hacían algunas rutas, dejaba
 * la card de la home y de /proyectos desactualizada.
 */
export function revalidateProjectPages(
  slug: string,
) {
  try {
    revalidatePath("/");
    revalidatePath("/proyectos");
    revalidatePath(`/modelos/${slug}`);
  } catch {
    // El dato ya se guardó; si falla la revalidación
    // no debe tirar abajo el guardado.
  }
}