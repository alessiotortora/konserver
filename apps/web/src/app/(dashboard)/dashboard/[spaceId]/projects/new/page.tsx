import { ProjectForm } from '@/components/forms/project-form';
import { Heading } from '@/components/layout/heading';
import { PageContainer } from '@/components/layout/page-container';
type Params = Promise<{ spaceId: string }>;

interface NewProjectPageProps {
  params: Params;
}

export default async function NewProjectPage({ params }: NewProjectPageProps) {
  const { spaceId } = await params;

  return (
    <PageContainer>
      <div className="space-y-6">
        <Heading title="Create Project" description="Create a new project in your space" />
        <ProjectForm spaceId={spaceId} />
      </div>
    </PageContainer>
  );
}
