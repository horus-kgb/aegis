import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Home, ArrowLeft, AlertTriangle, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">
            Access Denied
          </CardTitle>
          <div className="text-6xl font-bold text-destructive/20 mb-2">404</div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-destructive mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Unauthorized Route</span>
          </div>
          
          <p className="text-muted-foreground">
            The security perimeter you're trying to access doesn't exist or has been moved.
          </p>
          
          <div className="text-xs font-mono text-muted-foreground bg-muted/20 p-2 rounded border">
            Path: {location.pathname}
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button variant="premium" asChild className="w-full">
              <a href="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Command Center
              </a>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              If you believe this is an error, contact your system administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
