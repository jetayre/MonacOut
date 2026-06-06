//
//  MonacOutWidget.swift
//  Widget natif MonacOut — affiche les prochains événements de Monaco
//  sur l'écran d'accueil. Données : https://monacout.vercel.app/widget-events.json
//

import WidgetKit
import SwiftUI

// MARK: - Modèle

struct MonacEvent: Codable, Identifiable {
    var id: String { title + date }
    let date: String
    let iso: String
    let time: String
    let title: String
    let venue: String
    let quarter: String
    let emoji: String
}

struct WidgetPayload: Codable {
    let generatedAt: String
    let events: [MonacEvent]
}

// MARK: - Couleurs MonacOut

extension Color {
    static let monacNavy  = Color(red: 0.059, green: 0.114, blue: 0.227) // #0F1D3A
    static let monacGold  = Color(red: 0.769, green: 0.635, blue: 0.255) // #C4A241
    static let monacIvory = Color(red: 0.996, green: 0.992, blue: 0.973) // #FEFDF8
    static let monacBlue  = Color(red: 0.624, green: 0.765, blue: 0.863) // #9FC3DC
}

// MARK: - Timeline

struct EventEntry: TimelineEntry {
    let date: Date
    let events: [MonacEvent]
}

struct Provider: TimelineProvider {
    let sampleEvents = [
        MonacEvent(date: "Sam 6 juin", iso: "2026-06-06", time: "20h30",
                   title: "CONCERT À LA SALLE GARNIER", venue: "Salle Garnier",
                   quarter: "Monte-Carlo", emoji: "🎵"),
        MonacEvent(date: "Dim 7 juin", iso: "2026-06-07", time: "11h00",
                   title: "BRUNCH JAZZ", venue: "La Note Bleue",
                   quarter: "Larvotto", emoji: "🎷"),
        MonacEvent(date: "Lun 8 juin", iso: "2026-06-08", time: "19h00",
                   title: "CONFÉRENCE PHILOMONACO", venue: "Médiathèque",
                   quarter: "Monaco", emoji: "💭"),
    ]

    func placeholder(in context: Context) -> EventEntry {
        EventEntry(date: Date(), events: sampleEvents)
    }

    func getSnapshot(in context: Context, completion: @escaping (EventEntry) -> Void) {
        completion(EventEntry(date: Date(), events: sampleEvents))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<EventEntry>) -> Void) {
        fetchEvents { events in
            let list = events.isEmpty ? sampleEvents : events
            let entry = EventEntry(date: Date(), events: list)
            // Rafraîchir dans 3 heures
            let next = Calendar.current.date(byAdding: .hour, value: 3, to: Date())!
            completion(Timeline(entries: [entry], policy: .after(next)))
        }
    }

    private func fetchEvents(completion: @escaping ([MonacEvent]) -> Void) {
        guard let url = URL(string: "https://monacout.vercel.app/widget-events.json") else {
            completion([]); return
        }
        var req = URLRequest(url: url)
        req.cachePolicy = .reloadIgnoringLocalCacheData
        req.timeoutInterval = 10
        URLSession.shared.dataTask(with: req) { data, _, _ in
            guard let data = data,
                  let payload = try? JSONDecoder().decode(WidgetPayload.self, from: data) else {
                completion([]); return
            }
            completion(payload.events)
        }.resume()
    }
}

// MARK: - Vues

struct EventRow: View {
    let event: MonacEvent

    var body: some View {
        HStack(spacing: 8) {
            Text(event.emoji).font(.system(size: 18))
            VStack(alignment: .leading, spacing: 1) {
                Text(event.title)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.monacNavy)
                    .lineLimit(1)
                Text("\(event.date) · \(event.venue)")
                    .font(.system(size: 10))
                    .foregroundColor(.monacNavy.opacity(0.6))
                    .lineLimit(1)
            }
            Spacer(minLength: 0)
        }
    }
}

struct MonacOutWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var maxRows: Int { family == .systemLarge ? 6 : 3 }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 6) {
                Text("M")
                    .font(.system(size: 18, weight: .bold, design: .serif))
                    .foregroundColor(.monacNavy)
                Text("MONAC'OUT")
                    .font(.system(size: 11, weight: .semibold))
                    .tracking(2)
                    .foregroundColor(.monacGold)
                Spacer()
            }
            Rectangle().fill(Color.monacGold.opacity(0.4)).frame(height: 1)

            ForEach(entry.events.prefix(maxRows)) { event in
                EventRow(event: event)
            }
            Spacer(minLength: 0)
        }
        .padding(14)
        .containerBackground(for: .widget) { Color.monacIvory }
    }
}

// MARK: - Widget


struct MonacOutWidget: Widget {
    let kind: String = "MonacOutWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            MonacOutWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Prochains événements")
        .description("Les prochaines sorties à Monaco.")
        .supportedFamilies([.systemMedium, .systemLarge])
    }
}
