import React from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/Card";
import { Lightbulb } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
}

export const DashboardPlaceholder: React.FC<PlaceholderProps> = ({
  title,
  description,
}) => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[600px]">
        <Card variant="glass" className="p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lightbulb size={40} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
          <p className="text-foreground/70 mb-8">{description}</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const Projects: React.FC = () => (
  <DashboardPlaceholder
    title="Projects"
    description="Manage and organize your projects here. This section is coming soon!"
  />
);

const Settings: React.FC = () => (
  <DashboardPlaceholder
    title="Settings"
    description="Configure your dashboard settings. This section is coming soon!"
  />
);

export { Projects, Settings };
