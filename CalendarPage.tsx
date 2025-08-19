import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MainLayout from "@/components/layout/main-layout";
import { useEventStore } from "@/store/event-store";
import { Event } from "@/types";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/auth-utils";
import { useAuthStore } from "@/store/auth-store";

const colorOptions = [
  { value: "#7C3AED", label: "Purple" },
  { value: "#0EA5E9", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Yellow" },
  { value: "#EF4444", label: "Red" },
  { value: "#EC4899", label: "Pink" },
];

export default function CalendarPage() {
  const { events, createEvent, updateEvent, deleteEvent, getEvents, getEventCreatorInfo } = useEventStore();
  const { user } = useAuthStore();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState(colorOptions[0].value);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  // Get events for the selected date
  const eventsForSelectedDate = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  // Calendar day render function - Show dots for days with events
  const dayWithEvents = (day: Date) => {
    const dayHasEvents = events.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });

    return (
      <div className="relative">
        <div>{day.getDate()}</div>
        {dayHasEvents && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    );
  };

  // Handler for create event form submission
  const handleCreateEvent = () => {
    if (!selectedDate || !title.trim()) return;

    createEvent({
      title,
      description,
      date: selectedDate.toISOString(),
      time,
      color,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setTime("");
    setColor(colorOptions[0].value);
    setIsCreateDialogOpen(false);
  };

  // Handler for updating event
  const handleUpdateEvent = () => {
    if (!selectedEvent) return;

    updateEvent(selectedEvent.id, {
      title,
      description,
      time,
      color,
    });

    setIsEditDialogOpen(false);
    setIsViewDialogOpen(false);
  };

  // Handler for deleting event
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    deleteEvent(selectedEvent.id);
    setIsViewDialogOpen(false);
  };

  // Open edit dialog and populate form with event data
  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");
    setTime(event.time || "");
    setColor(event.color || colorOptions[0].value);
    setIsEditDialogOpen(true);
  };

  // Open view dialog with selected event
  const openViewDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          {/* Calendar */}
          <div className="bg-card rounded-lg border-2 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{format(date, "MMMM yyyy")}</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const prevMonth = new Date(date);
                    prevMonth.setMonth(date.getMonth() - 1);
                    setDate(prevMonth);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const nextMonth = new Date(date);
                    nextMonth.setMonth(date.getMonth() + 1);
                    setDate(nextMonth);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={date}
              className="rounded-md border"
              components={{
                DayContent: (props) => dayWithEvents(props.date),
              }}
            />
          </div>

          {/* Events for selected date */}
          <div className="bg-card rounded-lg border-2 shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {eventsForSelectedDate.length} event{eventsForSelectedDate.length !== 1 && "s"}
              </p>
            </div>
            {eventsForSelectedDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mb-2 opacity-30" />
                <p>No events for this day</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setIsCreateDialogOpen(true);
                  }}
                >
                  Add Event
                </Button>
              </div>
            ) : (
              <ul className="space-y-2">
                {eventsForSelectedDate.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => openViewDialog(event)}
                  >
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: event.color || colorOptions[0].value }}
                    ></div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <div className="flex justify-between items-center">
                        {event.time && <p className="text-sm text-muted-foreground">{event.time}</p>}
                        <p className="text-xs text-muted-foreground italic ml-2">
                          by {getEventCreatorInfo(event.userId)?.username}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                placeholder="Add details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Time (optional)
                </label>
                <Input
                  id="time"
                  placeholder="e.g., 3:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="color" className="text-sm font-medium">
                  Color
                </label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: option.value }}
                          ></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent} disabled={!title.trim()}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedEvent.color || colorOptions[0].value }}
                ></div>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </div>
              <DialogDescription>
                {selectedEvent.date && format(new Date(selectedEvent.date), "EEEE, MMMM d, yyyy")}
                {selectedEvent.time && ` at ${selectedEvent.time}`}
                <p className="text-xs mt-1">Created by {getEventCreatorInfo(selectedEvent.userId)?.username}</p>
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedEvent.description && (
                <p className="text-muted-foreground">{selectedEvent.description}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button variant="destructive" onClick={handleDeleteEvent}>
                Delete
              </Button>
              <Button onClick={() => openEditDialog(selectedEvent)}>Edit</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Make changes to your event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="edit-title"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="edit-description"
                placeholder="Add details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-time" className="text-sm font-medium">
                  Time (optional)
                </label>
                <Input
                  id="edit-time"
                  placeholder="e.g., 3:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-color" className="text-sm font-medium">
                  Color
                </label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger id="edit-color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: option.value }}
                          ></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent} disabled={!title.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}