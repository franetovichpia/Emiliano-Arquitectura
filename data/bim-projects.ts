export type BimModelFormat =
  | "ifc"
  | "frag";

export type BimProject = {
  slug: string;
  number: string;
  title: string;
  label: string;
  schema: string;
  modelFormat: BimModelFormat;
  modelUrl: string;
  modelSize: string;
};

export const bimProjects:
  readonly BimProject[] = [
    {
      slug: "crea-studios",
      number: "01",
      title: "Crea Studios",
      label: "Demostración BIM",
      schema: "IFC4",
      modelFormat: "ifc",
      modelUrl:
        "/models/crea-studios-materials.ifc?v=2",
      modelSize: "24,18 MB",
    },
  ];

export function getBimProject(
  slug: string,
) {
  return bimProjects.find(
    (project) =>
      project.slug === slug,
  );
}