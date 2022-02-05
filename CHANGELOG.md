## Changelog
### [0.0.26](https://github.com/SkepticMystic/data-analysis/compare/0.0.25...0.0.26) (2022-02-05)


### Features

* **Correlation Report:** :sparkles: Add button confirming selection of dropdown in case report doesn't refresh ([f806ed3](https://github.com/SkepticMystic/data-analysis/commit/f806ed3ae026b913f6012cf1a38319bc7e6194e1))

### [0.0.25](https://github.com/SkepticMystic/data-analysis/compare/0.0.24...0.0.25) (2022-01-31)


### Fixes

* **Correlation Report:** :bug: Render dropdown from full list of potential factors, not whatever's currently in the report ([0a50a44](https://github.com/SkepticMystic/data-analysis/commit/0a50a4482f29bae36eb5fe44797412615cd255ef))

### [0.0.24](https://github.com/SkepticMystic/data-analysis/compare/0.0.22...0.0.24) (2022-01-17)


### Features

* **Correlation Report:** :sparkles: Filter by sample size ([#35](https://github.com/SkepticMystic/data-analysis/issues/35)) ([dde62d8](https://github.com/SkepticMystic/data-analysis/commit/dde62d87070125c7e0d6e1b063e5a9a454fd798a))
* **WriteToCSV:** :sparkles: Use Supercharged Links if available ([33539e7](https://github.com/SkepticMystic/data-analysis/commit/33539e72f2cd1a6447590a028f58721c8a9afcd7))
* **WriteToCSV:** :sparkles: Write nested fields to CSV ([c19faae](https://github.com/SkepticMystic/data-analysis/commit/c19faaef6bd69eb3fe441dd2f924640aa5457773))


### Fixes

* **Correlation Report:** :bug: Support list field values in report dropdown ([77bfd7b](https://github.com/SkepticMystic/data-analysis/commit/77bfd7b1cd3b43c40d9bc044113736475794c287)), closes [#37](https://github.com/SkepticMystic/data-analysis/issues/37)
* **CorrelationView:** :bug: Don't hide slider value with slider handle (fix [#15](https://github.com/SkepticMystic/data-analysis/issues/15)) ([8f8823c](https://github.com/SkepticMystic/data-analysis/commit/8f8823c456f741a7062d926d298f4ab18f2e8457))

### [0.0.23](https://github.com/SkepticMystic/data-analysis/compare/0.0.22...0.0.23) (2022-01-16)


### Features

* **Correlation Report:** :sparkles: Filter by sample size ([#35](https://github.com/SkepticMystic/data-analysis/issues/35)) ([dde62d8](https://github.com/SkepticMystic/data-analysis/commit/dde62d87070125c7e0d6e1b063e5a9a454fd798a))
* **WriteToCSV:** :sparkles: Use Supercharged Links if available ([33539e7](https://github.com/SkepticMystic/data-analysis/commit/33539e72f2cd1a6447590a028f58721c8a9afcd7))
* **WriteToCSV:** :sparkles: Write nested fields to CSV ([c19faae](https://github.com/SkepticMystic/data-analysis/commit/c19faaef6bd69eb3fe441dd2f924640aa5457773))


### Fixes

* **Correlation Report:** :bug: Support list field values in report dropdown ([77bfd7b](https://github.com/SkepticMystic/data-analysis/commit/77bfd7b1cd3b43c40d9bc044113736475794c287)), closes [#37](https://github.com/SkepticMystic/data-analysis/issues/37)
* **CorrelationView:** :bug: Don't hide slider value with slider handle (fix [#15](https://github.com/SkepticMystic/data-analysis/issues/15)) ([8f8823c](https://github.com/SkepticMystic/data-analysis/commit/8f8823c456f741a7062d926d298f4ab18f2e8457))

### [0.0.22](https://github.com/SkepticMystic/data-analysis/compare/0.0.21...0.0.22) (2022-01-13)


### Fixes

* **Correlation Report:** :bug: Remove index col in tables to fix [#36](https://github.com/SkepticMystic/data-analysis/issues/36) ([e66a0eb](https://github.com/SkepticMystic/data-analysis/commit/e66a0eb945c85bd5d983b9b79453d42b3c61fc22))
* **StatsModal:** :bug: Don't filter out 0's, only undefineds ([6e747be](https://github.com/SkepticMystic/data-analysis/commit/6e747be825e19ed21231eec775ad5570672c3dcf))

### [0.0.21](https://github.com/SkepticMystic/data-analysis/compare/0.0.20...0.0.21) (2022-01-12)


### Documentation

* :memo: Update Changelog ([fe9d041](https://github.com/SkepticMystic/data-analysis/commit/fe9d041d9098d8a480d2318004177103bef37fd4))

### [0.0.20](https://github.com/SkepticMystic/data-analysis/compare/0.0.19...0.0.20) (2022-01-11)


### Features

* :sparkles: Allow other splitters in splitAndTrim ([278e43b](https://github.com/SkepticMystic/data-analysis/commit/278e43b542f5c6417791ad30c9a329f6fc9db98f))
* :sparkles: Summary report view!

### Documentation

* :memo: Add TSDocs to functions ([078966b](https://github.com/SkepticMystic/data-analysis/commit/078966bd3847f8a90aeef101483e9833cb77cfce))


### Fixes

* :bug: Save settings after changing them ([02800fa](https://github.com/SkepticMystic/data-analysis/commit/02800fa1bbd2c2b2be6a9ce2d0eb068ee58b3c1a))
* **CorrelationView:** :bug: CorrelationView no longer errors when file doesn't exist in the index. ([8f5f0c0](https://github.com/SkepticMystic/data-analysis/commit/8f5f0c021373b63d70a1104371ffd7d65c449f96))
* **CorrelationView:** :bug: Import buildAllCorrelations function after refactor. ([3d6809f](https://github.com/SkepticMystic/data-analysis/commit/3d6809fdbd1b23496fd8499f317f06094d3b15f8))
* **WriteToCSV:** :bug: Not exactly sure why, but this works better now ([691f2b2](https://github.com/SkepticMystic/data-analysis/commit/691f2b2cd511f132665c7e3dd386d3602cda0800))

### [0.0.19](https://github.com/SkepticMystic/data-analysis/compare/0.0.18...0.0.19) (2022-01-08)

### [0.0.18](https://github.com/SkepticMystic/data-analysis/compare/0.0.17...0.0.18) (2022-01-08)


### Features

* **CorrelationView:** :sparkles: Right click to open ChartModal on currently selected row ([a33af7c](https://github.com/SkepticMystic/data-analysis/commit/a33af7ce20edd32e1c61d55018637975a300985a))
* **CorrelationView:** :sparkles: Right click to open StatsModal (only if selected cell is a field, not a number) ([7328d18](https://github.com/SkepticMystic/data-analysis/commit/7328d18acd2b0b49aed0f46bb1b00adeb1afe0c2))
* **CorrelationView:** :sparkles: Show sample size as tooltip ([8341e4e](https://github.com/SkepticMystic/data-analysis/commit/8341e4e67f25ff1160ac15c06cf2ae11718d30f5))


### Fixes

* **ChartModal:** :bug: Display descriptive error message if selected correlation fields do not contain all numeric values ([0e64b51](https://github.com/SkepticMystic/data-analysis/commit/0e64b51aa9fe0e7227e2706d9afc61678ad99e12)), closes [#13](https://github.com/SkepticMystic/data-analysis/issues/13)
* **CorrelationView:** :bug: Avoid duplicate correlations by never adding them in the first place ([6e55fc6](https://github.com/SkepticMystic/data-analysis/commit/6e55fc6be9f3b42ac8ff64e419d630568b3b442a))

### [0.0.17](https://github.com/SkepticMystic/data-analysis/compare/0.0.16...0.0.17) (2022-01-07)


### Features

* :sparkles: roundNumber better than .toFixed() ([85eed96](https://github.com/SkepticMystic/data-analysis/commit/85eed9641ff2d0171332bb93a21a299ac5da3743))
* **ChartModal:** :sparkles: Show sample size ([c20c3fa](https://github.com/SkepticMystic/data-analysis/commit/c20c3fae8979b119752e96ba49657045df98ec39))
* **StatsModal:** :sparkles: Show sample size as row ([f0dff55](https://github.com/SkepticMystic/data-analysis/commit/f0dff559cb4e6fc73b7e32fde63ceff02670b3bf))


### Documentation

* :memo: Add documentation on CorrelationView and Development ([cf499c8](https://github.com/SkepticMystic/data-analysis/commit/cf499c888bbde40202a05aa80594a98fa3638182))

### [0.0.16](https://github.com/SkepticMystic/data-analysis/compare/0.0.15...0.0.16) (2022-01-06)

### [0.0.15](https://github.com/SkepticMystic/data-analysis/compare/0.0.14...0.0.15) (2022-01-06)


### Features

* **Analyses:** :sparkles: Ability to skip test if isQuant has been checked externally ([55fa850](https://github.com/SkepticMystic/data-analysis/commit/55fa850df36da34e2eee460d4323b3bc01fbd82b))
* **CorrelationView:** :sparkles: Working double slider! ([b920e60](https://github.com/SkepticMystic/data-analysis/commit/b920e60f976950eb8b500b491a79e50feb3ed81f))


### Fixes

* **ChartModal:** :bug: Don't filter out 0's (fix [#4](https://github.com/SkepticMystic/data-analysis/issues/4)) ([0811031](https://github.com/SkepticMystic/data-analysis/commit/08110315e4e10e4faf6ed2dee0744731e50e5753))

### [0.0.14](https://github.com/SkepticMystic/data-analysis/compare/0.0.13...0.0.14) (2022-01-05)


### Features

* **StatsModal:** :sparkles: Search selector like with ChartModal ([837540c](https://github.com/SkepticMystic/data-analysis/commit/837540cc43c7947f5921b208754a6be519d57c47))

### [0.0.13](https://github.com/SkepticMystic/data-analysis/compare/0.0.12...0.0.13) (2022-01-05)


### Features

* **ChartModal:** :sparkles: Search bars instead of checkbox hell ([b4c55e6](https://github.com/SkepticMystic/data-analysis/commit/b4c55e63912ffce7ab0d0b894fe984845d3bc384))

### [0.0.12](https://github.com/SkepticMystic/data-analysis/compare/0.0.11...0.0.12) (2022-01-05)


### Features

* **WriteToCSV:** :sparkles: Integrate nested fields ([6d70ee9](https://github.com/SkepticMystic/data-analysis/commit/6d70ee931170f91142f2cd21716ea6924a4d47d2))

### [0.0.11](https://github.com/SkepticMystic/data-analysis/compare/0.0.10...0.0.11) (2022-01-05)


### Features

* **CorrelationView:** :sparkles: Absolute value toggle ([25d3d1f](https://github.com/SkepticMystic/data-analysis/commit/25d3d1f2a8d9631a3ac4d106eddea61fd0178c84))
* **CorrelationView:** :sparkles: Refresh button ([7bae266](https://github.com/SkepticMystic/data-analysis/commit/7bae266987afca4e9ea8ac2052ac66c356285aa0))


### Fixes

* **WriteToCSV:** :bug: Allow more non-null fields thru ([c1c00f3](https://github.com/SkepticMystic/data-analysis/commit/c1c00f37a29948b09ecb3fef70d5dd298d5f3e4b))

### [0.0.10](https://github.com/SkepticMystic/data-analysis/compare/0.0.9...0.0.10) (2022-01-05)


### Fixes

* **CorrelationView:** :bug: Don't open onLoad for now ([b814e20](https://github.com/SkepticMystic/data-analysis/commit/b814e2095e000954f94377f101f7942fae70c0e2))

### [0.0.9](https://github.com/SkepticMystic/data-analysis/compare/0.0.8...0.0.9) (2022-01-05)


### Features

* **CorrelationView:** :sparkles: Work with subfields! ([389bb8b](https://github.com/SkepticMystic/data-analysis/commit/389bb8b7c6f9cf3822025ccca28ff4f8dab177c4))


### Fixes

* :bug: Don't add duplicate fields in kebab-case ([5856deb](https://github.com/SkepticMystic/data-analysis/commit/5856deb24c9dbcb541101f1f85019fb31c31c0c6))
* :bug: Remove duplicate fields from fieldsToCheck ([e344ecb](https://github.com/SkepticMystic/data-analysis/commit/e344ecb0d409d1635e583addca3c94db2e9bffa9))
* **CorrelationView:** :bug: Fix table scrolling ([8854261](https://github.com/SkepticMystic/data-analysis/commit/8854261e98d413cf004f5b88a011448ad3a8d464))
* **CorrelationView:** :bug: Load and unload properly ([affa9de](https://github.com/SkepticMystic/data-analysis/commit/affa9de71dae15675a0f694755726cbebca92ae5))

### [0.0.8](https://github.com/SkepticMystic/data-analysis/compare/0.0.7...0.0.8) (2022-01-05)


### Features

* :sparkles: Handle links and lists of links ([ab5e410](https://github.com/SkepticMystic/data-analysis/commit/ab5e410bc88c0ff7c6d5dd3eb58e5bc38c4c4ab3))
* **CorrelationView:** :sparkles: Working! ([e485ab0](https://github.com/SkepticMystic/data-analysis/commit/e485ab033b202f5aee319bf7246898b2b648ea67))

### [0.0.7](https://github.com/SkepticMystic/data-analysis/compare/0.0.6...0.0.7) (2022-01-05)


### Features

* **WriteToCSV:** :sparkles: Working export to CSV! ([125591a](https://github.com/SkepticMystic/data-analysis/commit/125591affde47bf54961f2a528f462d2186866ba))

### [0.0.6](https://github.com/SkepticMystic/data-analysis/compare/0.0.5...0.0.6) (2022-01-04)


### Features

* :sparkles: Add all numeric fields! ([6b73d29](https://github.com/SkepticMystic/data-analysis/commit/6b73d291c9d28a92ed63f120fdb12743dd740f66))
* :sparkles: Field Lists! Give the path to a file with a list of fields to check for data ([a9924b5](https://github.com/SkepticMystic/data-analysis/commit/a9924b59bb2296bb5111a2e14cbc603e8b9c254b))

### [0.0.5](https://github.com/SkepticMystic/data-analysis/compare/0.0.4...0.0.5) (2022-01-04)


### Documentation

* :memo: Update Readme ([5d90f14](https://github.com/SkepticMystic/data-analysis/commit/5d90f146e02f26fa92c3d1fc757b5a1ec0a4cfd7))

### [0.0.4](https://github.com/SkepticMystic/data-analysis/compare/0.0.3...0.0.4) (2022-01-04)


### Features

* **Analyses:** :sparkles: Lots of new analysis functions ([957b2b0](https://github.com/SkepticMystic/data-analysis/commit/957b2b0ea1a82818191055377ac9824b0d157ea4))
* **ChartModal:** :sparkles: Choose from a range of dates from your daily notes ([5f9ae8d](https://github.com/SkepticMystic/data-analysis/commit/5f9ae8d7cbf45843f7c58f64bf523346fe42710f))
* **StatsModal:** :sparkles: Working StatsModal! ([5763983](https://github.com/SkepticMystic/data-analysis/commit/57639831c22d6e2e40d31213cf543dc59e816016))


### Fixes

* :bug: Don't return length 1 arrays when they will always be that long ([7efe362](https://github.com/SkepticMystic/data-analysis/commit/7efe36289c9ea506f11dc263b41028fafb13e16f))

### [0.0.3](https://github.com/SkepticMystic/data-analysis/compare/0.0.2...0.0.3) (2022-01-04)


### Features

* :sparkles: Support different list types for inline fields ([b9e605b](https://github.com/SkepticMystic/data-analysis/commit/b9e605b0eb5484508a58837731ab6c4e56cef70b))
* **ChartModal:** :sparkles: Change colour of data points ([02f26e8](https://github.com/SkepticMystic/data-analysis/commit/02f26e894b1e4fecd7a9bd1d0cfe602d5fa63234))
* **ChartModal:** :sparkles: Parse daily note dates, and allow narrowing of date range ([eb2de51](https://github.com/SkepticMystic/data-analysis/commit/eb2de519499459e4d193b89ccf3df75ed6d91fd3))
* **ChartModal:** :sparkles: Show selected fields as axes titles ([1cd708a](https://github.com/SkepticMystic/data-analysis/commit/1cd708ac245801923f412a3783a9bceea77f5b26))

### 0.0.2 (2022-01-04)


### Features

* :sparkles: Basic AnalysisModal working with Svelte! ([cbf5881](https://github.com/SkepticMystic/data-analysis/commit/cbf5881951dfbd1c94008399deb1d166e915b11f))
* :sparkles: Checkbox component ([359d4ae](https://github.com/SkepticMystic/data-analysis/commit/359d4ae5181e4bf360292c65e9cb85e925d6d6e2))
* :sparkles: Provide a list of fields to check for data ([a45f23b](https://github.com/SkepticMystic/data-analysis/commit/a45f23b41072d42ec6f67998ab1fa45c22bb1f97))
* :sparkles: Refresh Index cmd ([31a7d0e](https://github.com/SkepticMystic/data-analysis/commit/31a7d0e9725044d306962bc2a822fba26d349770))
* **Analyses:** :sparkles: Pearson Correlation function ([8ea1a6e](https://github.com/SkepticMystic/data-analysis/commit/8ea1a6eec76df7c36d07626321a67d657274f10a))
* **ChartModal:** :sparkles: Working Scatterplot! ([825c5f7](https://github.com/SkepticMystic/data-analysis/commit/825c5f773f2e51bdf6fd5167bd2f7d7f03648fdb))
