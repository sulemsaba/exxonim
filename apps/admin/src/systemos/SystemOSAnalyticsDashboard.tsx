import { useState } from 'react';

import type { SystemOSAnalyticsDashboardProps, SystemOSAnalyticsRange } from './types';
import {
  buildAnalyticsSnapshot,
  buildTrendChartGeometry,
  chartDateLabel,
  createHeroMetrics,
  formatDate,
  timeUntil,
  trendMeta,
} from './utils';

function TrendChart({ range, snapshot }: { range: SystemOSAnalyticsRange; snapshot: ReturnType<typeof buildAnalyticsSnapshot> }) {
  const geometry = buildTrendChartGeometry(snapshot.trafficSeries, snapshot.markerCounts);
  const linePath = geometry.points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');
  const baseY = geometry.pad.top + geometry.plotHeight;
  const areaPath = geometry.points.length
    ? `${linePath} L ${geometry.points[geometry.points.length - 1].x.toFixed(2)} ${baseY.toFixed(2)} L ${geometry.points[0].x.toFixed(2)} ${baseY.toFixed(2)} Z`
    : '';

  return (
    <svg className="trend-chart" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const y = geometry.pad.top + (geometry.plotHeight * index) / 4;
        const value = Math.round(geometry.maxValue - (geometry.maxValue * index) / 4);
        return (
          <g key={`grid-${index}`}>
            <line className="grid-line" x1={geometry.pad.left} y1={y} x2={geometry.width - geometry.pad.right} y2={y} />
            <text x={0} y={y + 4}>
              {value}
            </text>
          </g>
        );
      })}
      <line
        className="axis-line"
        x1={geometry.pad.left}
        y1={baseY}
        x2={geometry.width - geometry.pad.right}
        y2={baseY}
      />
      {areaPath ? <path className="area" d={areaPath} /> : null}
      {linePath ? <path className="line" d={linePath} /> : null}
      {geometry.markers.map((marker) => (
        <g key={marker.day}>
          <line className="marker-stem" x1={marker.point.x} y1={marker.point.y + 9} x2={marker.point.x} y2={baseY} />
          <circle className="marker" cx={marker.point.x} cy={marker.point.y} r={4.5} />
          {marker.count > 1 ? (
            <text className="marker-count" x={marker.point.x + 8} y={marker.point.y - 8}>
              {marker.count}
            </text>
          ) : null}
        </g>
      ))}
      {geometry.xTickIndexes.map((index) => {
        const point = geometry.points[index];
        if (!point) return null;
        return (
          <text key={`tick-${index}`} x={point.x} y={geometry.height - 8} textAnchor="middle">
            {chartDateLabel(point.date, range)}
          </text>
        );
      })}
    </svg>
  );
}

export function SystemOSAnalyticsDashboard({
  posts,
  defaultRange = 30,
  onOpenPost,
  onShowTrending,
  onCreateSimilar,
}: SystemOSAnalyticsDashboardProps) {
  const [range, setRange] = useState<SystemOSAnalyticsRange>(defaultRange);
  const snapshot = buildAnalyticsSnapshot(posts, range);
  const heroMetrics = createHeroMetrics(snapshot);
  const viewsTrend = trendMeta(snapshot.totalViews, snapshot.previousViews);

  const optimizeTarget = [...snapshot.postMetrics].sort((a, b) => a.seo - b.seo || b.risk - a.risk)[0];
  const insights = [
    {
      title: `${snapshot.bestCategory.label} is the best category right now`,
      note: `${snapshot.bestCategory.label} is averaging ${Math.round(snapshot.bestCategory.viewsPerPost)} views per post with ${Math.round(
        snapshot.bestCategory.engagementAvg,
      )}% engagement.`,
    },
    {
      title:
        snapshot.categories.length > 1
          ? `${snapshot.bestCategory.label} performs ${snapshot.categoryRatio}x better than ${snapshot.worstCategory.label}`
          : 'Only one category is being tracked right now',
      note:
        snapshot.categories.length > 1
          ? `${snapshot.worstCategory.label} is lagging on views per post. Tighten headlines, metadata, and update cadence there first.`
          : 'Add a second category or publish more content to compare editorial performance across topics.',
    },
    {
      title: 'Fresh publishing is outperforming the back catalog',
      note:
        snapshot.cadenceRatio !== '1.0'
          ? `Posts touched in the last 30 days are driving ${snapshot.cadenceRatio}x the traffic of older content.`
          : 'Recent publishing is carrying nearly all current traffic, so keep the cadence steady.',
    },
    {
      title: `${snapshot.lowSeoCount} posts need direct SEO work next`,
      note: 'Fix missing metadata first, then improve underperforming posts with low read depth and weak completion.',
    },
  ];

  const liveItems = [
    {
      title: `${snapshot.liveReaders} users reading right now`,
      note: `${snapshot.posts.length} live posts are generating current session activity.`,
    },
    {
      title: `${snapshot.topLivePost ? snapshot.topLivePost.post.title : 'No post'} viewed ${snapshot.lastMinuteViews} times in the last minute`,
      note: snapshot.topLivePost ? `${snapshot.topLivePost.currentViews.toLocaleString()} views in the selected window.` : 'No live view spike detected yet.',
    },
    {
      title: snapshot.nextScheduledPost
        ? `${snapshot.nextScheduledPost.title} goes live ${timeUntil(snapshot.nextScheduledPost.scheduledFor)}`
        : `${snapshot.publishedInPeriod} posts were published in this ${range}-day window`,
      note: snapshot.nextScheduledPost
        ? `Next scheduled release is set for ${formatDate(snapshot.nextScheduledPost.scheduledFor)}.`
        : 'No upcoming scheduled release is queued right now.',
    },
    {
      title: `${snapshot.bestCategory.label} is leading the live traffic mix`,
      note: `${Math.round(snapshot.bestCategory.viewsPerPost)} average views per post is the current benchmark.`,
    },
  ];

  return (
    <section id="analyticsScreen">
      <section className="analytics-hero" id="analyticsStats">
        {heroMetrics.map((metric) => (
          <article className="card hero-card" key={metric.label}>
            <div className="hero-top">
              <div className="hero-label">{metric.label}</div>
              <span className={`trend-pill ${metric.trend.className}`}>{metric.trend.label}</span>
            </div>
            <div className="hero-value">{metric.value}</div>
            <div className="hero-note">{metric.note}</div>
          </article>
        ))}
      </section>

      <section className="card analytics-panel analytics-panel-wide">
        <div className="analytics-head">
          <div>
            <div className="analytics-kicker">Traffic Trend</div>
            <div className="analytics-title">Views over time</div>
            <div className="analytics-copy">What is happening right now across the selected period.</div>
          </div>
          <div className="analytics-toggle" id="analyticsRangeToggles">
            {([7, 30, 90] as const).map((value) => (
              <button
                key={value}
                type="button"
                className={`analytics-toggle-btn ${range === value ? 'active' : ''}`}
                onClick={() => setRange(value)}
              >
                {value} Days
              </button>
            ))}
          </div>
        </div>
        <div className="chart-shell">
          <div className="chart-metrics">
            <div className="chart-kpi">
              <div className="chart-kpi-label">Views in period</div>
              <div className="chart-kpi-value">{snapshot.totalViews.toLocaleString()}</div>
              <div className="chart-kpi-note">
                {viewsTrend.label} vs previous {range}-day period
              </div>
            </div>
            <div className="analytics-legend">
              <span className="legend-item">
                <span className="legend-swatch" />
                Views
              </span>
              <span className="legend-item">
                <span className="legend-dot" />
                Published post marker
              </span>
            </div>
          </div>
          <div className="chart-frame">
            <TrendChart range={range} snapshot={snapshot} />
          </div>
        </div>
      </section>

      <div className="analytics-grid">
        <section className="card analytics-panel">
          <div className="analytics-head">
            <div>
              <div className="analytics-kicker">Best Performing</div>
              <div className="analytics-title">Top posts</div>
              <div className="analytics-copy">Which articles are leading on traffic and engagement.</div>
            </div>
          </div>
          <div className="table-wrap analytics-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Views</th>
                  <th>Read Time</th>
                  <th>SEO</th>
                  <th>Engagement</th>
                  <th>Signal</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.topPosts.length ? (
                  snapshot.topPosts.map((item) => (
                    <tr key={item.post.id}>
                      <td>
                        <button className="title-btn" type="button" onClick={() => onOpenPost?.(item.post.id, 'basics')}>
                          {item.post.title}
                        </button>
                        <div className="subtext">
                          {item.post.category} | {item.post.author}
                        </div>
                      </td>
                      <td>{item.currentViews.toLocaleString()}</td>
                      <td>{item.readMinutes} min</td>
                      <td>{item.seo}%</td>
                      <td>
                        {item.engagement}%
                        <div className="subtext">{item.completion}% completion</div>
                      </td>
                      <td>
                        <span className={`signal-badge ${item.signal}`}>
                          {item.signal === 'trending' ? 'Trending' : item.signal === 'dropping' ? 'Dropping' : 'Stable'}
                        </span>
                        <div className="subtext">
                          {item.trend > 0 ? '+' : ''}
                          {item.trend.toFixed(0)}% vs previous
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <div className="subtext">No tracked posts yet.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card analytics-panel">
          <div className="analytics-head">
            <div>
              <div className="analytics-kicker">SEO Analytics</div>
              <div className="analytics-title">Optimization overview</div>
              <div className="analytics-copy">See the score, the warnings, and what needs fixing next.</div>
            </div>
          </div>
          <div className="seo-grid">
            <div className="seo-score">
              <div className="seo-score-label">Average SEO score</div>
              <div className="seo-score-value">{Math.round(snapshot.avgSeo)}</div>
              <div className="seo-score-note">
                {snapshot.lowSeoCount} posts need optimization before they start costing search traffic.
              </div>
            </div>
            <div className="progress-stack">
              {[
                {
                  label: 'Average SEO score',
                  value: `${Math.round(snapshot.avgSeo)} / 100`,
                  width: Math.round(snapshot.avgSeo),
                  tone: snapshot.avgSeo >= 80 ? 'good' : snapshot.avgSeo >= 70 ? 'warn' : 'bad',
                },
                {
                  label: 'Posts below 70',
                  value: `${snapshot.lowSeoCount} of ${snapshot.posts.length}`,
                  width: snapshot.lowSeoShare,
                  tone: 'bad',
                },
                {
                  label: 'Meta title coverage',
                  value: `${snapshot.titleCoverage}%`,
                  width: snapshot.titleCoverage,
                  tone: snapshot.titleCoverage >= 80 ? 'good' : snapshot.titleCoverage >= 65 ? 'warn' : 'bad',
                },
                {
                  label: 'Meta description coverage',
                  value: `${snapshot.descriptionCoverage}%`,
                  width: snapshot.descriptionCoverage,
                  tone: snapshot.descriptionCoverage >= 80 ? 'good' : snapshot.descriptionCoverage >= 65 ? 'warn' : 'bad',
                },
                {
                  label: 'Slug hygiene',
                  value: `${snapshot.slugCoverage}%`,
                  width: snapshot.slugCoverage,
                  tone: snapshot.slugCoverage >= 85 ? 'good' : snapshot.slugCoverage >= 70 ? 'warn' : 'bad',
                },
              ].map((item) => (
                <div className="progress-row" key={item.label}>
                  <div className="progress-meta">
                    <div className="progress-label">{item.label}</div>
                    <div className="progress-value">{item.value}</div>
                  </div>
                  <div className="progress-bar">
                    <span className={`progress-fill ${item.tone}`} style={{ width: `${item.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="issue-list">
              <div className="issue-item">
                <strong>Missing meta title</strong>
                <span>{snapshot.missingMetaTitle} posts should be fixed first.</span>
              </div>
              <div className="issue-item">
                <strong>Missing meta description</strong>
                <span>{snapshot.missingMetaDescription} posts have weak search snippets.</span>
              </div>
              <div className="issue-item">
                <strong>Slug issues</strong>
                <span>{snapshot.slugIssues} posts need cleaner URLs.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="card analytics-panel">
          <div className="analytics-head">
            <div>
              <div className="analytics-kicker">Needs Attention</div>
              <div className="analytics-title">Worst performing posts</div>
              <div className="analytics-copy">Low traffic, high bounce, and weak completion should get action first.</div>
            </div>
          </div>
          <div className="worst-list">
            {snapshot.worstPosts.length ? (
              snapshot.worstPosts.map((item) => (
                <article className="worst-item" key={item.post.id}>
                  <div className="item-head">
                    <div className="item-copy">
                      <button className="title-btn" type="button" onClick={() => onOpenPost?.(item.post.id, 'basics')}>
                        {item.post.title}
                      </button>
                      <div className="subtext">
                        {item.post.category} | {item.post.author}
                      </div>
                    </div>
                    <span className={`signal-badge ${item.signal === 'dropping' ? 'dropping' : 'steady'}`}>
                      {item.signal === 'dropping' ? 'Dropping' : 'Needs work'}
                    </span>
                  </div>
                  <div className="metric-inline">
                    <span>{item.currentViews.toLocaleString()} views</span>
                    <span>{item.bounce}% bounce</span>
                    <span>{item.readMinutes} min read</span>
                    <span>{item.seo}% SEO</span>
                  </div>
                  <div className="hero-note">
                    Traffic is soft and completion is only {item.completion}%. This post should be reworked before the next publishing cycle.
                  </div>
                  <div className="inline-action-row">
                    <button className="btn small" type="button" onClick={() => onOpenPost?.(item.post.id, 'seo')}>
                      Improve SEO
                    </button>
                    <button className="btn small" type="button" onClick={() => onOpenPost?.(item.post.id, 'content')}>
                      Update content
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="hero-note">No weak posts found in the current dataset.</div>
            )}
          </div>
        </section>

        <section className="card analytics-panel">
          <div className="analytics-head">
            <div>
              <div className="analytics-kicker">Audience</div>
              <div className="analytics-title">Visitor mix</div>
              <div className="analytics-copy">A simple picture of who is reading and where they come from.</div>
            </div>
          </div>
          <div className="audience-layout">
            <div className="audience-ring" style={{ background: `conic-gradient(#5a9a73 0 ${snapshot.returningShare}%, #c79b53 ${snapshot.returningShare}% 100%)` }}>
              <div className="audience-ring-center">
                <div className="audience-ring-value">{snapshot.returningShare}%</div>
                <div className="audience-ring-note">Returning visitors</div>
              </div>
            </div>
            <div className="audience-details">
              <div className="audience-legend">
                <div className="audience-card">
                  <div className="audience-card-label">New visitors</div>
                  <div className="audience-card-value">{snapshot.newShare}%</div>
                  <div className="audience-card-note">
                    {Math.round((snapshot.uniqueVisitors * snapshot.newShare) / 100).toLocaleString()} people discovered content for the first time.
                  </div>
                </div>
                <div className="audience-card">
                  <div className="audience-card-label">Returning visitors</div>
                  <div className="audience-card-value">{snapshot.returningShare}%</div>
                  <div className="audience-card-note">
                    {Math.round((snapshot.uniqueVisitors * snapshot.returningShare) / 100).toLocaleString()} readers came back for another session.
                  </div>
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">Device type</div>
                <div className="device-list">
                  {[
                    { label: 'Mobile', share: snapshot.mobileShare, tone: 'warn' },
                    { label: 'Desktop', share: snapshot.desktopShare, tone: 'good' },
                  ].map((item) => (
                    <div className="device-row" key={item.label}>
                      <div className="device-head">
                        <strong>{item.label}</strong>
                        <span>{item.share}%</span>
                      </div>
                      <div className="progress-bar">
                        <span className={`progress-fill ${item.tone}`} style={{ width: `${item.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">Top countries</div>
                <div className="country-list">
                  {snapshot.countries.map((country) => (
                    <div className="country-row" key={country.label}>
                      <div className="country-head">
                        <strong>{country.label}</strong>
                        <span>{country.share}%</span>
                      </div>
                      <div className="progress-bar">
                        <span className="progress-fill good" style={{ width: `${country.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card analytics-panel analytics-panel-wide">
          <div className="analytics-head">
            <div>
              <div className="analytics-kicker">Engagement + Insights</div>
              <div className="analytics-title">What should I do next?</div>
              <div className="analytics-copy">Metrics matter most when they end in a clear editorial decision.</div>
            </div>
          </div>
          <div className="analytics-split">
            <div className="engagement-grid">
              {[
                {
                  label: 'Avg scroll depth',
                  value: `${Math.round(snapshot.avgScroll)}%`,
                  note: `${trendMeta(snapshot.avgScroll, snapshot.prevAvgScroll).label} vs previous period.`,
                },
                {
                  label: 'Reading time',
                  value: `${snapshot.avgRead.toFixed(1)} min`,
                  note: `${trendMeta(snapshot.avgRead, snapshot.prevAvgRead, false, 1).label} per session.`,
                },
                {
                  label: 'Completion rate',
                  value: `${Math.round(snapshot.avgCompletion)}%`,
                  note: `${trendMeta(snapshot.avgCompletion, snapshot.prevAvgCompletion).label} of readers finish the article.`,
                },
              ].map((item) => (
                <article className="engagement-card" key={item.label}>
                  <div className="engagement-label">{item.label}</div>
                  <div className="engagement-value">{item.value}</div>
                  <div className="engagement-note">{item.note}</div>
                </article>
              ))}
            </div>

            <div className="insight-list">
              {insights.map((item) => (
                <article className="insight-card" key={item.title}>
                  <div className="insight-title">{item.title}</div>
                  <div className="insight-note">{item.note}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="card analytics-panel analytics-panel-wide">
          <div className="analytics-head">
            <div>
              <div className="analytics-kicker">Live Operations</div>
              <div className="analytics-title">Real-time + actions</div>
              <div className="analytics-copy">Keep the dashboard live and make the next action obvious.</div>
            </div>
          </div>
          <div className="realtime-grid">
            <div className="analytics-feed">
              {liveItems.map((item) => (
                <article className="live-item" key={item.title}>
                  <div className="live-title">{item.title}</div>
                  <div className="live-note">{item.note}</div>
                </article>
              ))}
            </div>
            <div className="action-stack">
              <button className="action-btn" type="button" onClick={() => optimizeTarget && onOpenPost?.(optimizeTarget.post.id, 'seo')}>
                <span className="action-title">Optimize low SEO posts</span>
                <span className="action-note">{snapshot.lowSeoCount} posts are below 70 and should be fixed first.</span>
              </button>
              <button className="action-btn" type="button" onClick={() => onShowTrending?.()}>
                <span className="action-title">View trending posts</span>
                <span className="action-note">
                  {snapshot.topLivePost ? snapshot.topLivePost.post.title : 'The strongest article'} is currently leading the library.
                </span>
              </button>
              <button
                className="action-btn"
                type="button"
                onClick={() => {
                  if (snapshot.topLivePost) onCreateSimilar?.(snapshot.topLivePost.post.id);
                }}
              >
                <span className="action-title">Create similar post</span>
                <span className="action-note">{snapshot.bestCategory.label} is the strongest category to expand next.</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
