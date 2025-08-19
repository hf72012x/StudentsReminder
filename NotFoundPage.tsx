import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Calendar, Home } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Calendar className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-7xl font-bold mb-4">404</h1>
      <p className="text-xl mb-2 text-muted-foreground">Oops! Page not found</p>
      <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist or has been moved.</p>
      
      <Button onClick={() => navigate('/')} size="lg" className="flex items-center">
        <Home className="mr-2 h-5 w-5" />
        Return home
      </Button>
    </div>
  )
}

export default NotFoundPage