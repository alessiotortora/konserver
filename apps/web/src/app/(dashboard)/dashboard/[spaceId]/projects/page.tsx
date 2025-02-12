import { Heading } from '@/components/layout/heading';
import { PageContainer } from '@/components/layout/page-container';
import { ProjectGrid } from '@/components/projects/project-grid';
import { Button } from '@/components/ui/button';
import { getProjects } from '@/lib/actions/get/get-projects';
import Link from 'next/link';

type Params = Promise<{ spaceId: string }>;

interface ProjectsPageProps {
  params: Params;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { spaceId } = await params;
  const { success, projects = [], error } = await getProjects(spaceId);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading title="Projects" description="Manage and organize your projects" />
          <Button asChild>
            <Link href={`/dashboard/${spaceId}/projects/new`}>Create Project</Link>
          </Button>
        </div>

        <ProjectGrid projects={projects} spaceId={spaceId} error={success ? undefined : error} />
      </div>
    </PageContainer>
  );
}
