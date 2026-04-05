import type { AdminRouteMatch } from '@exxonim/admin-core/lib/adminRoutes';
import type { ApiPage, ApiContentStatus } from '@exxonim/admin-core/types/api';

import { useMemo, useState, useEffect } from 'react';
import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  slugify,
  getAdminErrorMessage,
  toDatetimeLocalValue,
  fromDatetimeLocalValue,
  formatWorkflowStatusLabel,
} from '@exxonim/admin-core/utils/admin';
import {
  getAdminPages,
  approveAdminPage,
  archiveAdminPage,
  createAdminPage,
  publishAdminPage,
  rejectAdminPage,
  submitAdminPageForReview,
  updateAdminPage,
  type AdminPagePayload,
} from '@exxonim/admin-core/services/adminPageService';
import {
  getAdminJob,
  getAdminJobs,
  createAdminJob,
  updateAdminJob,
  deleteAdminJob,
  type AdminJobPayload,
} from '@exxonim/admin-core/services/adminJobsService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

type FormMessage = { tone: 'success' | 'error'; text: string } | null;

type CareerPageContent = {
  hero: { eyebrow: string; title: string; description: string };
  focus_areas: string[];
  status: {
    label: string;
    description: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

type CareerPageFormValues = {
  recordTitle: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  focusAreasText: string;
  statusLabel: string;
  statusDescription: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  metaTitle: string;
  metaDescription: string;
  status: ApiContentStatus;
};

type JobFormValues = {
  title: string;
  slug: string;
  department: string;
  employmentType: string;
  locationMode: string;
  city: string;
  country: string;
  compensationLabel: string;
  experienceLabel: string;
  summary: string;
  description: string;
  requirementsText: string;
  responsibilitiesText: string;
  status: ApiContentStatus;
  publishedAt: string;
};

type PageWorkflowAction = 'submit' | 'approve' | 'reject' | 'publish' | 'archive';

const employmentTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Consulting'];
const locationModeOptions = ['Onsite', 'Remote', 'Hybrid'];

const defaultCareerPageValues: CareerPageFormValues = {
  recordTitle: 'Careers',
  heroEyebrow: 'Careers',
  heroTitle: 'Join Exxonim',
  heroDescription:
    'Help clients move from business setup to operational confidence with a practical service team.',
  focusAreasText:
    'Business registration\nLicensing and permits\nTax and returns\nCompliance support',
  statusLabel: 'Applications open',
  statusDescription:
    'We are reviewing practical operators, analysts, and client support hires.',
  primaryLabel: 'Apply now',
  primaryHref: '/request-consultation/',
  secondaryLabel: 'Talk to Exxonim',
  secondaryHref: '/contact/',
  metaTitle: 'Careers | Exxonim',
  metaDescription:
    'Explore current Exxonim roles across registration, licensing, tax, and compliance support.',
  status: 'draft',
};

const defaultJobFormValues: JobFormValues = {
  title: '',
  slug: '',
  department: '',
  employmentType: 'Full-time',
  locationMode: 'Onsite',
  city: 'Dar es Salaam',
  country: 'Tanzania',
  compensationLabel: '',
  experienceLabel: '',
  summary: '',
  description: '',
  requirementsText: '',
  responsibilitiesText: '',
  status: 'draft',
  publishedAt: '',
};

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatLocation(city: string, country: string, locationMode: string) {
  const label = [city, country].filter(Boolean).join(', ');
  return label || locationMode;
}

function getCareerPage(pages?: ApiPage<Record<string, unknown>>[] | null) {
  return pages?.find((page) => page.slug === 'career') ?? null;
}

function toCareerPageValues(page: ApiPage<Record<string, unknown>> | null): CareerPageFormValues {
  if (!page) return defaultCareerPageValues;
  const content = (page.content ?? {}) as Partial<CareerPageContent>;
  return {
    recordTitle: page.title || 'Careers',
    heroEyebrow: content.hero?.eyebrow ?? defaultCareerPageValues.heroEyebrow,
    heroTitle: content.hero?.title ?? defaultCareerPageValues.heroTitle,
    heroDescription: content.hero?.description ?? defaultCareerPageValues.heroDescription,
    focusAreasText: (content.focus_areas ?? []).join('\n'),
    statusLabel: content.status?.label ?? defaultCareerPageValues.statusLabel,
    statusDescription: content.status?.description ?? defaultCareerPageValues.statusDescription,
    primaryLabel: content.status?.primary?.label ?? defaultCareerPageValues.primaryLabel,
    primaryHref: content.status?.primary?.href ?? defaultCareerPageValues.primaryHref,
    secondaryLabel: content.status?.secondary?.label ?? defaultCareerPageValues.secondaryLabel,
    secondaryHref: content.status?.secondary?.href ?? defaultCareerPageValues.secondaryHref,
    metaTitle: page.meta_title ?? defaultCareerPageValues.metaTitle,
    metaDescription: page.meta_description ?? defaultCareerPageValues.metaDescription,
    status: page.status ?? 'draft',
  };
}

function buildCareerPagePayload(values: CareerPageFormValues): AdminPagePayload {
  return {
    title: values.recordTitle.trim() || values.heroTitle.trim() || 'Careers',
    slug: 'career',
    meta_title: values.metaTitle.trim() || null,
    meta_description: values.metaDescription.trim() || null,
    status: values.status,
    content: {
      hero: {
        eyebrow: values.heroEyebrow.trim(),
        title: values.heroTitle.trim(),
        description: values.heroDescription.trim(),
      },
      focus_areas: splitLines(values.focusAreasText),
      status: {
        label: values.statusLabel.trim(),
        description: values.statusDescription.trim(),
        primary: { label: values.primaryLabel.trim(), href: values.primaryHref.trim() },
        secondary: { label: values.secondaryLabel.trim(), href: values.secondaryHref.trim() },
      },
    },
  };
}

function toJobFormValues(job?: Awaited<ReturnType<typeof getAdminJob>> | null): JobFormValues {
  if (!job) return defaultJobFormValues;
  return {
    title: job.title,
    slug: job.slug,
    department: job.department,
    employmentType: job.employment_type,
    locationMode: job.location_mode,
    city: job.city,
    country: job.country,
    compensationLabel: job.compensation_label ?? '',
    experienceLabel: job.experience_label ?? '',
    summary: job.summary,
    description: job.description,
    requirementsText: job.requirements.join('\n'),
    responsibilitiesText: job.responsibilities.join('\n'),
    status: job.status ?? 'draft',
    publishedAt: toDatetimeLocalValue(job.published_at),
  };
}

function buildJobPayload(values: JobFormValues): AdminJobPayload {
  return {
    title: values.title.trim(),
    slug: values.slug.trim() || slugify(values.title),
    department: values.department.trim(),
    employment_type: values.employmentType.trim(),
    location_mode: values.locationMode.trim(),
    city: values.city.trim(),
    country: values.country.trim(),
    compensation_label: values.compensationLabel.trim() || null,
    experience_label: values.experienceLabel.trim() || null,
    summary: values.summary.trim(),
    description: values.description.trim(),
    requirements: splitLines(values.requirementsText),
    responsibilities: splitLines(values.responsibilitiesText),
    status: values.status,
    published_at: values.publishedAt ? fromDatetimeLocalValue(values.publishedAt) : null,
  };
}

function ActionToast({ message, onClose }: { message: FormMessage; onClose: () => void }) {
  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={3200}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      onClose={(_, reason) => {
        if (reason !== 'clickaway') onClose();
      }}
    >
      <Alert
        variant="filled"
        severity={message?.tone === 'success' ? 'success' : 'error'}
        onClose={onClose}
        sx={{ width: '100%', boxShadow: 6 }}
      >
        {message?.text}
      </Alert>
    </Snackbar>
  );
}

export function CareersRoutePanel({ match }: { match: AdminRouteMatch }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const [message, setMessage] = useState<FormMessage>(null);
  const [pageValues, setPageValues] = useState(defaultCareerPageValues);
  const [jobValues, setJobValues] = useState(defaultJobFormValues);

  const pagesQuery = useQuery({ queryKey: ['admin-next', 'pages'], queryFn: getAdminPages });
  const jobsQuery = useQuery({ queryKey: ['admin-next', 'jobs'], queryFn: getAdminJobs });
  const jobQuery = useQuery({
    queryKey: ['admin-next', 'job', match.entitySlug],
    queryFn: () => getAdminJob(match.entitySlug!),
    enabled: match.section === 'jobs' && match.mode === 'edit' && Boolean(match.entitySlug),
  });

  const careerPage = useMemo(() => getCareerPage(pagesQuery.data), [pagesQuery.data]);
  const isJobEditorOpen = match.section === 'jobs' && (match.mode === 'new' || match.mode === 'edit');
  const currentPageStatus = pageValues.status || 'draft';

  useEffect(() => {
    setPageValues(toCareerPageValues(careerPage));
  }, [careerPage]);

  useEffect(() => {
    if (match.mode === 'new') setJobValues(defaultJobFormValues);
    else if (jobQuery.data) setJobValues(toJobFormValues(jobQuery.data));
  }, [jobQuery.data, match.mode]);

  const savePageMutation = useMutation({
    mutationFn: async () => {
      const payload = buildCareerPagePayload(pageValues);
      return careerPage ? updateAdminPage(careerPage.id, payload) : createAdminPage(payload);
    },
    onSuccess: async (savedPage) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'pages'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
      ]);
      setPageValues(toCareerPageValues(savedPage));
      setMessage({
        tone: 'success',
        text: careerPage ? 'Careers page saved.' : 'Careers page draft created.',
      });
    },
    onError: (error) =>
      setMessage({ tone: 'error', text: getAdminErrorMessage(error, 'Unable to save the careers page.') }),
  });

  const pageWorkflowMutation = useMutation({
    mutationFn: async (action: PageWorkflowAction) => {
      const targetId = careerPage?.id;

      if (!targetId) {
        throw new Error('Save the careers page before running workflow actions.');
      }

      switch (action) {
        case 'submit':
          return submitAdminPageForReview(targetId);
        case 'approve':
          return approveAdminPage(targetId);
        case 'reject':
          return rejectAdminPage(targetId);
        case 'publish':
          return publishAdminPage(targetId);
        case 'archive':
          return archiveAdminPage(targetId);
        default:
          throw new Error('Unsupported page workflow action.');
      }
    },
    onSuccess: async (savedPage, action) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'pages'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
      ]);

      setPageValues(toCareerPageValues(savedPage));

      const successMessages: Record<PageWorkflowAction, string> = {
        submit: 'Careers page submitted for review.',
        approve: 'Careers page approved and published.',
        reject: 'Careers page rejected.',
        publish: 'Careers page published.',
        archive: 'Careers page archived.',
      };

      setMessage({ tone: 'success', text: successMessages[action] });
    },
    onError: (error) =>
      setMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to run this page workflow action.'),
      }),
  });

  const canSubmitPageForReview =
    Boolean(careerPage) &&
    hasPermission('page.submit_review') &&
    (currentPageStatus === 'draft' || currentPageStatus === 'rejected');
  const canApprovePage =
    Boolean(careerPage) &&
    hasPermission('page.approve') &&
    currentPageStatus === 'pending_review';
  const canRejectPage =
    Boolean(careerPage) &&
    hasPermission('page.reject') &&
    currentPageStatus === 'pending_review';
  const canPublishPage =
    Boolean(careerPage) &&
    hasPermission('page.publish') &&
    (currentPageStatus === 'draft' ||
      currentPageStatus === 'pending_review' ||
      currentPageStatus === 'rejected');
  const canArchivePage =
    Boolean(careerPage) &&
    hasPermission('page.archive') &&
    currentPageStatus !== 'archived';
  const isPageActionPending = savePageMutation.isPending || pageWorkflowMutation.isPending;

  const saveJobMutation = useMutation({
    mutationFn: async () => {
      const payload = buildJobPayload(jobValues);
      return match.mode === 'edit' && jobQuery.data
        ? updateAdminJob(jobQuery.data.slug, payload)
        : createAdminJob(payload);
    },
    onSuccess: async (savedJob) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'jobs'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
      ]);
      setMessage({ tone: 'success', text: match.mode === 'edit' ? 'Position updated.' : 'Position created.' });
      router.replace(adminRoutes.jobEdit(savedJob.slug));
    },
    onError: (error) =>
      setMessage({ tone: 'error', text: getAdminErrorMessage(error, 'Unable to save this position.') }),
  });

  const deleteJobMutation = useMutation({
    mutationFn: deleteAdminJob,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'jobs'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
      ]);
      setMessage({ tone: 'success', text: 'Position deleted.' });
      router.replace(adminRoutes.jobs);
    },
    onError: (error) =>
      setMessage({ tone: 'error', text: getAdminErrorMessage(error, 'Unable to delete this position.') }),
  });

  if (pagesQuery.isLoading || jobsQuery.isLoading) return <Alert severity="info">Loading careers workspace...</Alert>;
  if (pagesQuery.isError) return <Alert severity="error">{getAdminErrorMessage(pagesQuery.error, 'Unable to load the careers page.')}</Alert>;
  if (jobsQuery.isError) return <Alert severity="error">{getAdminErrorMessage(jobsQuery.error, 'Unable to load career positions.')}</Alert>;

  return (
    <>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, xl: 7 }}>
            <Card>
              <CardHeader
                title="Careers page"
                subheader="Edit the public careers page copy without touching raw JSON."
              />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Record title"
                        value={pageValues.recordTitle}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, recordTitle: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Workflow status"
                        value={formatWorkflowStatusLabel(pageValues.status)}
                        helperText="Status changes happen through the workflow buttons below."
                        slotProps={{ input: { readOnly: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Hero eyebrow"
                        value={pageValues.heroEyebrow}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, heroEyebrow: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Hero title"
                        value={pageValues.heroTitle}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, heroTitle: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Hero description"
                        value={pageValues.heroDescription}
                        onChange={(event) =>
                          setPageValues((current) => ({
                            ...current,
                            heroDescription: event.target.value,
                          }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        label="Focus areas"
                        helperText="One item per line."
                        value={pageValues.focusAreasText}
                        onChange={(event) =>
                          setPageValues((current) => ({
                            ...current,
                            focusAreasText: event.target.value,
                          }))
                        }
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Status label"
                        value={pageValues.statusLabel}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, statusLabel: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Primary CTA label"
                        value={pageValues.primaryLabel}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, primaryLabel: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Status description"
                        value={pageValues.statusDescription}
                        onChange={(event) =>
                          setPageValues((current) => ({
                            ...current,
                            statusDescription: event.target.value,
                          }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Primary CTA link"
                        value={pageValues.primaryHref}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, primaryHref: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Secondary CTA label"
                        value={pageValues.secondaryLabel}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, secondaryLabel: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Secondary CTA link"
                        value={pageValues.secondaryHref}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, secondaryHref: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Meta title"
                        value={pageValues.metaTitle}
                        onChange={(event) =>
                          setPageValues((current) => ({ ...current, metaTitle: event.target.value }))
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Meta description"
                        value={pageValues.metaDescription}
                        onChange={(event) =>
                          setPageValues((current) => ({
                            ...current,
                            metaDescription: event.target.value,
                          }))
                        }
                      />
                    </Grid>
                  </Grid>

                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={1.5}
                    useFlexGap
                  >
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      <Chip
                        size="small"
                        variant="outlined"
                        color={
                          currentPageStatus === 'published'
                            ? 'success'
                            : currentPageStatus === 'pending_review'
                              ? 'warning'
                              : currentPageStatus === 'rejected' || currentPageStatus === 'archived'
                                ? 'error'
                                : 'default'
                        }
                        label={formatWorkflowStatusLabel(currentPageStatus)}
                      />
                      {!careerPage ? (
                        <Chip size="small" variant="outlined" label="Create a draft first" />
                      ) : null}
                    </Stack>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => savePageMutation.mutate()}
                        disabled={isPageActionPending}
                      >
                        {savePageMutation.isPending
                          ? 'Saving...'
                          : careerPage
                            ? 'Save careers page'
                            : 'Create draft'}
                      </Button>
                      {canSubmitPageForReview ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          onClick={() => pageWorkflowMutation.mutate('submit')}
                          disabled={isPageActionPending}
                        >
                          Submit for review
                        </Button>
                      ) : null}
                      {canRejectPage ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => pageWorkflowMutation.mutate('reject')}
                          disabled={isPageActionPending}
                        >
                          Reject
                        </Button>
                      ) : null}
                      {canApprovePage ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => pageWorkflowMutation.mutate('approve')}
                          disabled={isPageActionPending}
                        >
                          Approve
                        </Button>
                      ) : null}
                      {canPublishPage ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => pageWorkflowMutation.mutate('publish')}
                          disabled={isPageActionPending}
                        >
                          Publish
                        </Button>
                      ) : null}
                      {canArchivePage ? (
                        <Button
                          size="small"
                          color="inherit"
                          onClick={() => pageWorkflowMutation.mutate('archive')}
                          disabled={isPageActionPending}
                        >
                          Archive
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, xl: 5 }}>
            <Stack spacing={3}>
              <Card>
                <CardHeader
                  title="Open positions"
                  subheader={`${jobsQuery.data?.length ?? 0} roles managed in the careers workspace.`}
                  action={
                    <Button component={RouterLink} href={adminRoutes.jobsNew} variant="contained" size="small">
                      Add position
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  <Stack spacing={1.5}>
                    {jobsQuery.data?.length ? (
                      jobsQuery.data.map((job) => {
                        const isSelected = match.section === 'jobs' && match.entitySlug === job.slug;

                        return (
                          <Box
                            key={job.id}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: isSelected ? 'primary.main' : 'divider',
                              bgcolor: isSelected ? 'action.selected' : 'background.paper',
                            }}
                          >
                            <Stack spacing={1.25}>
                              <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ sm: 'center' }}
                                justifyContent="space-between"
                                spacing={1}
                              >
                                <Typography variant="subtitle1">{job.title}</Typography>
                                <Chip
                                  size="small"
                                  label={job.status ?? 'draft'}
                                  color={job.status === 'published' ? 'success' : 'default'}
                                  variant="outlined"
                                />
                              </Stack>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {job.department} | {formatLocation(job.city, job.country, job.location_mode)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {job.summary}
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Button
                                  component={RouterLink}
                                  href={adminRoutes.jobEdit(job.slug)}
                                  size="small"
                                  variant={isSelected ? 'contained' : 'outlined'}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  color="error"
                                  variant="text"
                                  disabled={deleteJobMutation.isPending}
                                  onClick={() => {
                                    if (!window.confirm(`Delete "${job.title}"?`)) return;
                                    deleteJobMutation.mutate(job.slug);
                                  }}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </Stack>
                          </Box>
                        );
                      })
                    ) : (
                      <Alert severity="info">
                        No positions exist yet. Add the first role from this careers workspace.
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {isJobEditorOpen ? (
                <Card>
                  <CardHeader
                    title={match.mode === 'edit' ? 'Edit position' : 'New position'}
                    subheader="Normal fields only. No JSON editing."
                    action={
                      <Button component={RouterLink} href={adminRoutes.jobs} size="small" color="inherit">
                        Close
                      </Button>
                    }
                  />
                  <Divider />
                  <CardContent>
                    {jobQuery.isError ? (
                      <Alert severity="error">
                        {getAdminErrorMessage(jobQuery.error, 'Unable to load this position.')}
                      </Alert>
                    ) : match.mode === 'edit' && jobQuery.isLoading ? (
                      <Alert severity="info">Loading position...</Alert>
                    ) : (
                      <Stack spacing={2.5}>
                        <Grid container spacing={2.5}>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="Job title"
                              value={jobValues.title}
                              onChange={(event) =>
                                setJobValues((current) => {
                                  const nextTitle = event.target.value;
                                  const previousAutoSlug = slugify(current.title);
                                  const nextSlug =
                                    !current.slug || current.slug === previousAutoSlug
                                      ? slugify(nextTitle)
                                      : current.slug;
                                  return { ...current, title: nextTitle, slug: nextSlug };
                                })
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="Slug"
                              helperText="Keep this short and readable. It is used in the admin route."
                              value={jobValues.slug}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, slug: slugify(event.target.value) }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              label="Department"
                              value={jobValues.department}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, department: event.target.value }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              select
                              fullWidth
                              label="Status"
                              value={jobValues.status}
                              onChange={(event) =>
                                setJobValues((current) => ({
                                  ...current,
                                  status: event.target.value as ApiContentStatus,
                                }))
                              }
                            >
                              <MenuItem value="draft">Draft</MenuItem>
                              <MenuItem value="published">Published</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              select
                              fullWidth
                              label="Employment type"
                              value={jobValues.employmentType}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, employmentType: event.target.value }))
                              }
                            >
                              {employmentTypeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              select
                              fullWidth
                              label="Location mode"
                              value={jobValues.locationMode}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, locationMode: event.target.value }))
                              }
                            >
                              {locationModeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              label="City"
                              value={jobValues.city}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, city: event.target.value }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              label="Country"
                              value={jobValues.country}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, country: event.target.value }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              label="Experience label"
                              value={jobValues.experienceLabel}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, experienceLabel: event.target.value }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              label="Compensation label"
                              value={jobValues.compensationLabel}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, compensationLabel: event.target.value }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              type="datetime-local"
                              label="Publish timestamp"
                              value={jobValues.publishedAt}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, publishedAt: event.target.value }))
                              }
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              multiline
                              minRows={3}
                              label="Summary"
                              value={jobValues.summary}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, summary: event.target.value }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              multiline
                              minRows={5}
                              label="Description"
                              value={jobValues.description}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, description: event.target.value }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              multiline
                              minRows={4}
                              label="Requirements"
                              helperText="One requirement per line."
                              value={jobValues.requirementsText}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, requirementsText: event.target.value }))
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              multiline
                              minRows={4}
                              label="Responsibilities"
                              helperText="One responsibility per line."
                              value={jobValues.responsibilitiesText}
                              onChange={(event) =>
                                setJobValues((current) => ({ ...current, responsibilitiesText: event.target.value }))
                              }
                            />
                          </Grid>
                        </Grid>
                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                          <Button component={RouterLink} href={adminRoutes.jobs} size="small" color="inherit">
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => saveJobMutation.mutate()}
                            disabled={saveJobMutation.isPending}
                          >
                            {saveJobMutation.isPending
                              ? 'Saving...'
                              : match.mode === 'edit'
                                ? 'Save position'
                                : 'Create position'}
                          </Button>
                        </Stack>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader
                    title="Role editor"
                    subheader="Pick a role to edit or create a new position."
                  />
                  <Divider />
                  <CardContent>
                    <Alert severity="info">
                      Careers page copy and open positions now live in one workspace. Use Add position or open an existing role from the list.
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <ActionToast message={message} onClose={() => setMessage(null)} />
    </>
  );
}
