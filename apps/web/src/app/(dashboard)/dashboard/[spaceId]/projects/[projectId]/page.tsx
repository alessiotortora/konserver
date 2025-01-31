import { ProjectForm } from '@/components/forms/project-form';
import { Heading } from '@/components/layout/heading';
import { getProject } from '@/lib/actions/get/get-project';
import { getSpaceMedia } from '@/lib/actions/get/get-space-media';
import { notFound } from 'next/navigation';

type Params = Promise<{ spaceId: string; projectId: string }>;

interface ProjectPageProps {
  params: Params;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { spaceId, projectId } = await params;
  const [projectResult, mediaResult] = await Promise.all([
    getProject(spaceId, projectId),
    getSpaceMedia(spaceId),
  ]);

  if (!projectResult.success || !projectResult.project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Heading title="Edit Project" description="Update your project information" />
      <ProjectForm
        spaceId={spaceId}
        project={projectResult.project}
        contentId={projectResult.project.content.id}
        availableImages={mediaResult.success ? mediaResult.images : []}
        availableVideos={mediaResult.success ? mediaResult.videos : []}
      />
    </div>
  );
}
