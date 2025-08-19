import { useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Plus, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useEventStore } from "@/store/event-store";
import MainLayout from "@/components/layout/main-layout";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { events, getEvents, getEventCreatorInfo } = useEventStore();

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  // Get today's date
  const today = new Date();
  const formattedToday = format(today, "EEEE, MMMM d");

  // Filter events for today
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });

  // Filter upcoming events (excluding today)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5); // Show only next 5 events

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.username || "Student"}!</h1>
          <p className="text-muted-foreground">{formattedToday}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Today's events */}
          <Card className="col-span-2 border-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Events</CardTitle>
                <CardDescription>Your scheduled events for today</CardDescription>
              </div>
              <Link to="/calendar">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="min-h-[200px]">
              {todayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mb-2 opacity-30" />
                  <p>No events scheduled for today</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {todayEvents.map(event => (
                    <li key={event.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                      <div className="flex items-center">
                        {event.color ? (
                          <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: event.color }}></div>
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                        )}
                        <div>
                          <p className="font-medium">{event.title}</p>
                          {event.time && <p className="text-sm text-muted-foreground">{event.time}</p>}
                        </div>
                      </div>
                      <Link to={`/events/${event.id}`}>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="border-t p-4">
              <Link to="/events/new" className="w-full">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Event
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Stats Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>Overview of your activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Events</span>
                  <Badge variant="outline" className="bg-accent text-accent-foreground">
                    {events.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Today's Events</span>
                  <Badge variant="outline" className="bg-accent text-accent-foreground">
                    {todayEvents.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Upcoming Events</span>
                  <Badge variant="outline" className="bg-accent text-accent-foreground">
                    {upcomingEvents.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming events */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events coming in the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mb-2 opacity-30" />
                <p>No upcoming events</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcomingEvents.map(event => (
                  <li key={event.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                    <div className="flex items-center">
                      {event.color ? (
                        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: event.color }}></div>
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                      )}
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), "MMM d")}
                          {event.time && ` · ${event.time}`}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          by {getEventCreatorInfo(event.userId)?.username || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <Link to={`/events/${event.id}`}>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}