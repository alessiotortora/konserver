import { Heading } from '@/components/layout/heading';
import { ScrollContainer } from '@/components/layout/scroll-container';
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Heading title="Projects" description="Manage and organize your projects" />
        <Button asChild>
          <Link href={`/dashboard/${spaceId}/projects/new`}>Create Project</Link>
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollContainer>
        <ProjectGrid projects={projects} spaceId={spaceId} error={success ? undefined : error} />
      </ScrollContainer>
    </div>
  );
}
