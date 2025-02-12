import { ProjectForm } from '@/components/forms/project-form';
import { Heading } from '@/components/layout/heading';
import { PageContainer } from '@/components/layout/page-container';
import { getProject } from '@/lib/actions/get/get-project';
import { notFound } from 'next/navigation';

type Params = Promise<{ spaceId: string; projectId: string }>;

interface ProjectPageProps {
  params: Params;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { spaceId, projectId } = await params;
  const projectResult = await getProject(spaceId, projectId);

  if (!projectResult.success || !projectResult.project) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading title="Edit Project" description="Update your project information" />

        <ProjectForm
          spaceId={spaceId}
          project={projectResult.project}
          contentId={projectResult.project.content.id}
        />
      </div>
    </PageContainer>
  );
}
