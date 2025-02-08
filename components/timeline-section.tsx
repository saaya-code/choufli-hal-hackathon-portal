import { CalendarIcon, ClockIcon, StarIcon, MapPinIcon } from "lucide-react";

const timelineEvents = [
  {
    icon: <CalendarIcon className="h-8 w-8 text-primary" />,
    title: "Registration Opens",
    date: "March 1st, 2024",
    description: "Begin your journey with us",
  },
  {
    icon: <ClockIcon className="h-8 w-8 text-primary" />,
    title: "Kickoff Event",
    date: "March 15th, 2024",
    description: "Opening ceremony and team formation",
  },
  {
    icon: <StarIcon className="h-8 w-8 text-primary" />,
    title: "Hackathon Weekend",
    date: "March 16-17th, 2024",
    description: "48 hours of innovation",
  },
  {
    icon: <MapPinIcon className="h-8 w-8 text-primary" />,
    title: "Awards Ceremony",
    date: "March 17th, 2024",
    description: "Celebrate achievements",
  },
];

export function TimelineSection() {
  return (
    <section id="timeline" className="py-32 bg-accent/5">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Event Timeline
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className="relative p-6 pt-14 min-h-[200px] bg-white rounded-lg shadow-lg hover:transform hover:scale-105 transition-transform"
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-secondary/10 p-3 rounded-full">
                {event.icon}
              </div>
              <div className="pt-4 text-center">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-primary font-medium">{event.date}</p>
                <p className="text-muted-foreground mt-2">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
