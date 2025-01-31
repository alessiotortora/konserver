import { Heading } from '@/components/layout/heading';
import { ProjectActions } from '@/components/projects/project-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Projects" description="Manage and organize your projects" />
        <Button asChild>
          <Link href={`/dashboard/${spaceId}/projects/new`}>Create Project</Link>
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {success && projects.length === 0 && (
        <p className="text-muted-foreground">No projects found. Create your first project!</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="group relative">
            <Link href={`/dashboard/${spaceId}/projects/${project.id}`} className="block">
              <CardHeader>
                <CardTitle>{project.content.title || 'Untitled Project'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.content.description || 'No description'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm">{project.year}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span
                    className={`text-sm ${
                      project.content.status === 'published' ? 'text-green-500' : 'text-yellow-500'
                    }`}
                  >
                    {project.content.status}
                  </span>
                </div>
              </CardContent>
            </Link>
            <ProjectActions
              spaceId={spaceId}
              contentId={project.content.id}
              projectTitle={project.content.title || 'Untitled Project'}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
