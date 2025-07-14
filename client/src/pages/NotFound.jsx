import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-10 space-y-4">
          <h1 className="text-4xl font-bold text-destructive">404</h1>
          <p className="text-lg text-muted-foreground">Page Not Found</p>
          <p className="text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
