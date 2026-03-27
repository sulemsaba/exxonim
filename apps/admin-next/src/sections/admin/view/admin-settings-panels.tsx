import type {
  SiteSettingOfficeValue,
  SiteSettingContactMapValue,
  SiteSettingOfficeHourValue,
  SiteSettingSocialLinkValue,
} from '@exxonim/admin-core/types/api';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  normalizeHexColor,
  getAdminErrorMessage,
  getReadableForegroundColor,
} from '@exxonim/admin-core/utils/admin';
import {
  getBrandSetting,
  upsertBrandSetting,
  getContactMapSetting,
  getCompanyInfoSetting,
  upsertContactMapSetting,
  upsertCompanyInfoSetting,
} from '@exxonim/admin-core/services/adminStructuredSettingsService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

type FormMessage = { tone: 'success' | 'error'; text: string } | null;

type BrandFormValues = {
  name: string;
  companyShortName: string;
  legalCompanyName: string;
  tagline: string;
  lightLogoSrc: string;
  darkLogoSrc: string;
  faviconUrl: string;
  brandPrimary: string;
  brandSecondary: string;
};

const defaultBrandForm: BrandFormValues = {
  name: '',
  companyShortName: '',
  legalCompanyName: '',
  tagline: '',
  lightLogoSrc: '',
  darkLogoSrc: '',
  faviconUrl: '',
  brandPrimary: '#0f5c63',
  brandSecondary: '#73c7bb',
};

const officeHourLabels: Record<SiteSettingOfficeHourValue['day'], string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const defaultOfficeHourOrder: SiteSettingOfficeHourValue['day'][] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const socialPlatformOptions: SiteSettingSocialLinkValue['platform'][] = [
  'linkedin',
  'facebook',
  'instagram',
  'x',
  'youtube',
  'tiktok',
];

function LoadingState({ label }: { label: string }) {
  return <Alert severity="info">{label}</Alert>;
}

function ErrorState({ error, fallback }: { error: unknown; fallback: string }) {
  return <Alert severity="error">{getAdminErrorMessage(error, fallback)}</Alert>;
}

function SaveMessage({ message }: { message: FormMessage }) {
  if (!message) {
    return null;
  }

  return <Alert severity={message.tone === 'success' ? 'success' : 'error'}>{message.text}</Alert>;
}

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function defaultOfficeHours(): SiteSettingOfficeHourValue[] {
  return defaultOfficeHourOrder.map((day) => ({
    day,
    open: '08:00',
    close: '17:00',
    closed: day === 'saturday' || day === 'sunday',
  }));
}

function createOffice(index: number, isPrimary = index === 0): SiteSettingOfficeValue {
  return {
    id: `office-${Date.now()}-${index}`,
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: 'Tanzania',
    mapLabel: '',
    googleMapsUrl: '',
    embedUrl: '',
    latitude: null,
    longitude: null,
    isPrimary,
  };
}

function createSocialLink(): SiteSettingSocialLinkValue {
  return {
    platform: 'linkedin',
    label: '',
    url: '',
    isActive: true,
  };
}

function ColorPreview({
  title,
  color,
  detail,
}: {
  title: string;
  color: string;
  detail: string;
}) {
  const normalizedColor = normalizeHexColor(color, '#0f5c63');

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 2,
        bgcolor: normalizedColor,
        color: getReadableForegroundColor(normalizedColor),
      }}
    >
      <Typography variant="overline" sx={{ opacity: 0.88 }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.75 }}>
        {normalizedColor}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.88 }}>
        {detail}
      </Typography>
    </Paper>
  );
}

export function BrandSettingsPanel() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<FormMessage>(null);
  const [values, setValues] = useState<BrandFormValues>(defaultBrandForm);

  const brandQuery = useQuery({
    queryKey: ['admin-next', 'settings', 'brand'],
    queryFn: getBrandSetting,
  });
  const companyQuery = useQuery({
    queryKey: ['admin-next', 'settings', 'company'],
    queryFn: getCompanyInfoSetting,
  });

  useEffect(() => {
    if (!brandQuery.data && !companyQuery.data) {
      return;
    }

    setValues({
      name: companyQuery.data?.value.name ?? brandQuery.data?.value.name ?? '',
      companyShortName:
        companyQuery.data?.value.companyShortName ??
        brandQuery.data?.value.companyShortName ??
        '',
      legalCompanyName: companyQuery.data?.value.legalCompanyName ?? '',
      tagline: brandQuery.data?.value.tagline ?? '',
      lightLogoSrc: brandQuery.data?.value.lightLogoSrc ?? '',
      darkLogoSrc: brandQuery.data?.value.darkLogoSrc ?? '',
      faviconUrl: brandQuery.data?.value.faviconUrl ?? '',
      brandPrimary: brandQuery.data?.value.brandColors?.primary ?? '#0f5c63',
      brandSecondary: brandQuery.data?.value.brandColors?.secondary ?? '#73c7bb',
    });
  }, [brandQuery.data, companyQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        upsertBrandSetting({
          name: values.name,
          companyShortName: values.companyShortName,
          tagline: values.tagline,
          lightLogoSrc: values.lightLogoSrc,
          darkLogoSrc: values.darkLogoSrc,
          faviconUrl: values.faviconUrl || null,
          brandColors: {
            primary: normalizeHexColor(values.brandPrimary, '#0f5c63'),
            secondary: normalizeHexColor(values.brandSecondary, '#73c7bb'),
          },
        }),
        upsertCompanyInfoSetting({
          name: values.name,
          legalCompanyName: values.legalCompanyName,
          companyShortName: values.companyShortName,
          phones: companyQuery.data?.value.phones ?? [],
          emails: companyQuery.data?.value.emails ?? [],
          address: companyQuery.data?.value.address ?? '',
          whatsapp: companyQuery.data?.value.whatsapp ?? '',
        }),
      ]);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'settings', 'brand'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'settings', 'company'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
      ]);

      setMessage({ tone: 'success', text: 'Brand and company settings updated.' });
    },
    onError: (error) => {
      setMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to save brand settings.'),
      });
    },
  });

  if (brandQuery.isLoading || companyQuery.isLoading) {
    return <LoadingState label="Loading brand and company settings..." />;
  }

  if (brandQuery.isError) {
    return <ErrorState error={brandQuery.error} fallback="Unable to load brand settings." />;
  }

  if (companyQuery.isError) {
    return <ErrorState error={companyQuery.error} fallback="Unable to load company settings." />;
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        saveMutation.mutate();
      }}
    >
      <Stack spacing={3}>
        <SaveMessage message={message} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card>
              <CardHeader
                title="Brand identity"
                subheader="Keep public-facing company identity and visual references in one place."
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Display name"
                      value={values.name}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Company short name"
                      value={values.companyShortName}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          companyShortName: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Legal company name"
                      value={values.legalCompanyName}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          legalCompanyName: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      label="Tagline"
                      value={values.tagline}
                      onChange={(event) =>
                        setValues((current) => ({ ...current, tagline: event.target.value }))
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Card>
              <CardHeader
                title="Brand preview"
                subheader="Use valid hex colors to keep the admin and public identity aligned."
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${normalizeHexColor(values.brandPrimary, '#0f5c63')} 0%, ${normalizeHexColor(values.brandSecondary, '#73c7bb')} 100%)`,
                      color: getReadableForegroundColor(
                        normalizeHexColor(values.brandPrimary, '#0f5c63')
                      ),
                    }}
                  >
                    <Typography variant="overline" sx={{ opacity: 0.88 }}>
                      Live preview
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {values.companyShortName || values.name || 'Exxonim'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1.5, maxWidth: 360, opacity: 0.9 }}>
                      {values.tagline || 'Brand messaging preview will update as you type.'}
                    </Typography>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <ColorPreview
                        title="Primary"
                        color={values.brandPrimary}
                        detail="Used for emphasis, actions, and brand anchors."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <ColorPreview
                        title="Secondary"
                        color={values.brandSecondary}
                        detail="Used for contrast, highlights, and supporting surfaces."
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader
                title="Assets and colors"
                subheader="Store logo and favicon URLs directly until a media workflow is introduced."
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Light logo URL"
                      value={values.lightLogoSrc}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          lightLogoSrc: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Dark logo URL"
                      value={values.darkLogoSrc}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          darkLogoSrc: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Favicon URL"
                      value={values.faviconUrl}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          faviconUrl: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Primary brand color"
                      helperText="Accepts #RGB or #RRGGBB."
                      value={values.brandPrimary}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          brandPrimary: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Secondary brand color"
                      helperText="Accepts #RGB or #RRGGBB."
                      value={values.brandSecondary}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          brandSecondary: event.target.value,
                        }))
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save Brand Settings'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export function ContactSettingsPanel() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<FormMessage>(null);
  const [phonesText, setPhonesText] = useState('');
  const [emailsText, setEmailsText] = useState('');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [officeHours, setOfficeHours] = useState<SiteSettingOfficeHourValue[]>(defaultOfficeHours());
  const [offices, setOffices] = useState<SiteSettingOfficeValue[]>([createOffice(0)]);
  const [socialLinks, setSocialLinks] = useState<SiteSettingSocialLinkValue[]>([createSocialLink()]);

  const companyQuery = useQuery({
    queryKey: ['admin-next', 'settings', 'company'],
    queryFn: getCompanyInfoSetting,
  });
  const contactMapQuery = useQuery({
    queryKey: ['admin-next', 'settings', 'contact'],
    queryFn: getContactMapSetting,
  });

  useEffect(() => {
    if (!companyQuery.data?.value) {
      return;
    }

    setPhonesText(companyQuery.data.value.phones.join('\n'));
    setEmailsText(companyQuery.data.value.emails.join('\n'));
    setAddress(companyQuery.data.value.address);
    setWhatsapp(companyQuery.data.value.whatsapp);
  }, [companyQuery.data]);

  useEffect(() => {
    if (!contactMapQuery.data?.value) {
      return;
    }

    setOfficeHours(
      contactMapQuery.data.value.officeHours.length
        ? contactMapQuery.data.value.officeHours
        : defaultOfficeHours()
    );
    setOffices(
      contactMapQuery.data.value.offices.length
        ? contactMapQuery.data.value.offices
        : [createOffice(0)]
    );
    setSocialLinks(
      contactMapQuery.data.value.socialLinks.length
        ? contactMapQuery.data.value.socialLinks
        : [createSocialLink()]
    );
  }, [contactMapQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        upsertCompanyInfoSetting({
          name: companyQuery.data?.value.name ?? '',
          legalCompanyName: companyQuery.data?.value.legalCompanyName ?? '',
          companyShortName: companyQuery.data?.value.companyShortName ?? '',
          phones: splitLines(phonesText),
          emails: splitLines(emailsText),
          address,
          whatsapp,
        }),
        upsertContactMapSetting({
          officeHours,
          offices,
          socialLinks,
        } satisfies SiteSettingContactMapValue),
      ]);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'settings', 'company'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'settings', 'contact'] }),
      ]);

      setMessage({ tone: 'success', text: 'Contact and map settings updated.' });
    },
    onError: (error) => {
      setMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to save contact settings.'),
      });
    },
  });

  if (companyQuery.isLoading || contactMapQuery.isLoading) {
    return <LoadingState label="Loading contact and map settings..." />;
  }

  if (companyQuery.isError) {
    return <ErrorState error={companyQuery.error} fallback="Unable to load company settings." />;
  }

  if (contactMapQuery.isError) {
    return <ErrorState error={contactMapQuery.error} fallback="Unable to load contact map settings." />;
  }

  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        saveMutation.mutate();
      }}
    >
      <Stack spacing={3}>
        <SaveMessage message={message} />

        <Card>
          <CardHeader
            title="Contact channels"
            subheader="These values power phone, email, address, and WhatsApp callouts across the site."
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Phone numbers"
                  helperText="One number per line."
                  value={phonesText}
                  onChange={(event) => setPhonesText(event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Email addresses"
                  helperText="One email per line."
                  value={emailsText}
                  onChange={(event) => setEmailsText(event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Primary address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="WhatsApp"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Office hours"
            subheader="Structured schedule used in contact views and support messaging."
          />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              {officeHours.map((hour, index) => (
                <Paper key={hour.day} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      alignItems={{ md: 'center' }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box>
                        <Typography variant="subtitle1">{officeHourLabels[hour.day]}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Configure whether the office is open and the published hours.
                        </Typography>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={hour.closed}
                            onChange={(_, checked) =>
                              setOfficeHours((current) =>
                                current.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, closed: checked } : item
                                )
                              )
                            }
                          />
                        }
                        label="Closed"
                      />
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Open"
                          disabled={hour.closed}
                          value={hour.open}
                          onChange={(event) =>
                            setOfficeHours((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, open: event.target.value } : item
                              )
                            )
                          }
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Close"
                          disabled={hour.closed}
                          value={hour.close}
                          onChange={(event) =>
                            setOfficeHours((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, close: event.target.value } : item
                              )
                            )
                          }
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Offices"
            subheader="Each office can publish its own address and map references."
            action={
              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  setOffices((current) => [
                    ...current,
                    createOffice(current.length, !current.some((item) => item.isPrimary)),
                  ])
                }
              >
                Add office
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              {offices.map((office, index) => (
                <Paper key={office.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Stack spacing={2.5}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ md: 'center' }}
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1">Office {index + 1}</Typography>
                        {office.isPrimary ? <Chip size="small" color="primary" label="Primary" /> : null}
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={office.isPrimary}
                              onChange={(_, checked) =>
                                setOffices((current) => {
                                  const hasOtherPrimary = current.some(
                                    (item, itemIndex) => itemIndex !== index && item.isPrimary
                                  );

                                  return current.map((item, itemIndex) => {
                                    if (itemIndex === index) {
                                      return {
                                        ...item,
                                        isPrimary: checked || !hasOtherPrimary,
                                      };
                                    }

                                    return checked ? { ...item, isPrimary: false } : item;
                                  });
                                })
                              }
                            />
                          }
                          label="Primary office"
                        />
                        <Button
                          type="button"
                          color="error"
                          variant="text"
                          disabled={offices.length === 1}
                          onClick={() =>
                            setOffices((current) =>
                              current.filter((_, itemIndex) => itemIndex !== index)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Office name"
                          value={office.name}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, name: event.target.value } : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Map label"
                          value={office.mapLabel}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, mapLabel: event.target.value } : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Address line 1"
                          value={office.addressLine1}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, addressLine1: event.target.value }
                                  : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Address line 2"
                          value={office.addressLine2 ?? ''}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, addressLine2: event.target.value }
                                  : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="City"
                          value={office.city}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, city: event.target.value } : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={office.country}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, country: event.target.value } : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Google Maps URL"
                          value={office.googleMapsUrl}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, googleMapsUrl: event.target.value }
                                  : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Embed URL"
                          value={office.embedUrl ?? ''}
                          onChange={(event) =>
                            setOffices((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, embedUrl: event.target.value } : item
                              )
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Social links"
            subheader="Structured social links feed the public footer and contact surfaces."
            action={
              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  setSocialLinks((current) => [...current, createSocialLink()])
                }
              >
                Add social link
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              {socialLinks.map((link, index) => (
                <Paper key={`${link.platform}-${index}`} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                  <Stack spacing={2.5}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ md: 'center' }}
                      spacing={2}
                    >
                      <Typography variant="subtitle1">Social link {index + 1}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={link.isActive}
                              onChange={(_, checked) =>
                                setSocialLinks((current) =>
                                  current.map((item, itemIndex) =>
                                    itemIndex === index ? { ...item, isActive: checked } : item
                                  )
                                )
                              }
                            />
                          }
                          label="Active"
                        />
                        <Button
                          type="button"
                          color="error"
                          variant="text"
                          disabled={socialLinks.length === 1}
                          onClick={() =>
                            setSocialLinks((current) =>
                              current.filter((_, itemIndex) => itemIndex !== index)
                            )
                          }
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          select
                          fullWidth
                          label="Platform"
                          value={link.platform}
                          onChange={(event) =>
                            setSocialLinks((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      platform: event.target.value as SiteSettingSocialLinkValue['platform'],
                                    }
                                  : item
                              )
                            )
                          }
                        >
                          {socialPlatformOptions.map((platform) => (
                            <MenuItem key={platform} value={platform}>
                              {platform}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="Label"
                          value={link.label}
                          onChange={(event) =>
                            setSocialLinks((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, label: event.target.value } : item
                              )
                            )
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="URL"
                          value={link.url}
                          onChange={(event) =>
                            setSocialLinks((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, url: event.target.value } : item
                              )
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save Contact Settings'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
