module github.com/mattermost/mattermost-server/server/v8

go 1.19

require (
	code.sajari.com/docconv v1.3.5
	github.com/Masterminds/semver/v3 v3.2.1
	github.com/Masterminds/squirrel v1.5.4
	github.com/avct/uasurfer v0.0.0-20191028135549-26b5daa857f1
	github.com/aws/aws-sdk-go v1.44.240
	github.com/blang/semver v3.5.1+incompatible
	github.com/blevesearch/bleve/v2 v2.3.7
	github.com/cespare/xxhash/v2 v2.2.0
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/dgryski/dgoogauth v0.0.0-20190221195224-5a805980a5f3
	github.com/disintegration/imaging v1.6.2
	github.com/dyatlov/go-opengraph/opengraph v0.0.0-20220524092352-606d7b1e5f8a
	github.com/fsnotify/fsnotify v1.6.0
	github.com/getsentry/sentry-go v0.20.0
	github.com/go-sql-driver/mysql v1.7.1
	github.com/golang-migrate/migrate/v4 v4.15.2
	github.com/golang/freetype v0.0.0-20170609003504-e2365dfdc4a0
	github.com/golang/mock v1.6.0
	github.com/google/go-querystring v1.1.0
	github.com/gorilla/handlers v1.5.1
	github.com/gorilla/mux v1.8.0
	github.com/gorilla/schema v1.2.0
	github.com/gorilla/websocket v1.5.0
	github.com/graph-gophers/dataloader/v6 v6.0.0
	github.com/graph-gophers/dataloader/v7 v7.1.0
	github.com/graph-gophers/graphql-go v1.5.1-0.20230110080634-edea822f558a
	github.com/h2non/go-is-svg v0.0.0-20160927212452-35e8c4b0612c
	github.com/jaytaylor/html2text v0.0.0-20230321000545-74c2419ad056
	github.com/jmoiron/sqlx v1.3.5
	github.com/krolaw/zipstream v0.0.0-20180621105154-0a2661891f94
	github.com/ledongthuc/pdf v0.0.0-20220302134840-0c2507a12d80
	github.com/lib/pq v1.10.9
	github.com/mattermost/go-i18n v1.11.1-0.20211013152124-5c415071e404
	github.com/mattermost/gziphandler v0.0.1
	github.com/mattermost/logr/v2 v2.0.16
	github.com/mattermost/mattermost-server/server/public v0.0.0-00010101000000-000000000000
	github.com/mattermost/morph v1.0.5-0.20230511171014-e76e25978d56
	github.com/mattermost/rsc v0.0.0-20160330161541-bbaefb05eaa0
	github.com/mattermost/squirrel v0.2.0
	github.com/mgdelacroix/foundation v0.0.0-20220812143423-0bfc18f73538
	github.com/mholt/archiver/v3 v3.5.1
	github.com/microcosm-cc/bluemonday v1.0.23
	github.com/minio/minio-go/v7 v7.0.51
	github.com/mitchellh/mapstructure v1.5.0
	github.com/oklog/run v1.1.0
	github.com/oov/psd v0.0.0-20220121172623-5db5eafcecbb
	github.com/opentracing/opentracing-go v1.2.0
	github.com/pkg/errors v0.9.1
	github.com/prometheus/client_golang v1.14.0
	github.com/reflog/dateconstraints v0.2.1
	github.com/rivo/uniseg v0.4.4
	github.com/rs/cors v1.8.3
	github.com/rudderlabs/analytics-go v3.3.3+incompatible
	github.com/rwcarlsen/goexif v0.0.0-20190401172101-9e8deecbddbd
	github.com/sergi/go-diff v1.3.1
	github.com/sirupsen/logrus v1.9.0
	github.com/spf13/cobra v1.7.0
	github.com/spf13/viper v1.15.0
	github.com/splitio/go-client/v6 v6.3.1
	github.com/stretchr/testify v1.8.2
	github.com/throttled/throttled v2.2.5+incompatible
	github.com/tinylib/msgp v1.1.8
	github.com/uber/jaeger-client-go v2.30.0+incompatible
	github.com/uber/jaeger-lib v2.4.1+incompatible
	github.com/vmihailenco/msgpack/v5 v5.3.5
	github.com/wiggin77/merror v1.0.4
	github.com/writeas/go-strip-markdown v2.0.1+incompatible
	github.com/xtgo/uuid v0.0.0-20140804021211-a0b114877d4c
	github.com/yuin/goldmark v1.5.4
	golang.org/x/crypto v0.8.0
	golang.org/x/image v0.7.0
	golang.org/x/net v0.10.0
	golang.org/x/oauth2 v0.7.0
	golang.org/x/sync v0.2.0
	golang.org/x/tools v0.9.1
	gopkg.in/guregu/null.v4 v4.0.0
	gopkg.in/mail.v2 v2.3.1
	gopkg.in/yaml.v2 v2.4.0
	gopkg.in/yaml.v3 v3.0.1
)

require (
	github.com/HdrHistogram/hdrhistogram-go v0.9.0 // indirect
	github.com/JalfResi/justext v0.0.0-20221106200834-be571e3e3052 // indirect
	github.com/PuerkitoBio/goquery v1.8.1 // indirect
	github.com/RoaringBitmap/roaring v1.2.3 // indirect
	github.com/advancedlogic/GoOse v0.0.0-20210820140952-9d5822d4a625 // indirect
	github.com/araddon/dateparse v0.0.0-20210429162001-6b43995a97de // indirect
	github.com/bits-and-blooms/bitset v1.5.0 // indirect
	github.com/felixge/httpsnoop v1.0.3 // indirect
	github.com/go-resty/resty/v2 v2.7.0 // indirect
	github.com/golang/geo v0.0.0-20230404232722-c4acd7a044dc // indirect
	github.com/gomodule/redigo v2.0.0+incompatible // indirect
	github.com/gopherjs/gopherjs v1.17.2 // indirect
	github.com/klauspost/compress v1.16.4 // indirect
	github.com/mattn/go-runewidth v0.0.14 // indirect
	github.com/nwaples/rardecode v1.1.3 // indirect
	github.com/olekukonko/tablewriter v0.0.5 // indirect
	github.com/otiai10/gosseract/v2 v2.4.0 // indirect
	github.com/pelletier/go-toml/v2 v2.0.7 // indirect
	github.com/pierrec/lz4/v4 v4.1.17 // indirect
	github.com/prometheus/common v0.42.0 // indirect
	github.com/prometheus/procfs v0.9.0 // indirect
	github.com/redis/go-redis/v9 v9.0.3 // indirect
	github.com/richardlehane/mscfb v1.0.4 // indirect
	github.com/segmentio/backo-go v1.0.1 // indirect
	github.com/spf13/afero v1.9.5 // indirect
	github.com/tidwall/gjson v1.14.4 // indirect
	github.com/tidwall/pretty v1.2.1 // indirect
	github.com/ulikunitz/xz v0.5.11 // indirect
	go.uber.org/atomic v1.10.0 // indirect
	golang.org/x/mod v0.10.0 // indirect
	golang.org/x/sys v0.8.0 // indirect
	golang.org/x/text v0.9.0 // indirect
	google.golang.org/appengine v1.6.7 // indirect
	google.golang.org/genproto v0.0.0-20230410155749-daa745c078e1 // indirect
	google.golang.org/grpc v1.54.0 // indirect
	google.golang.org/protobuf v1.30.0 // indirect
	gopkg.in/alexcesaro/quotedprintable.v3 v3.0.0-20150716171945-2caba252f4dc // indirect
	lukechampine.com/uint128 v1.3.0 // indirect
	modernc.org/sqlite v1.21.1 // indirect
	modernc.org/cc/v3 v3.40.0 // indirect
	modernc.org/ccgo/v3 v3.16.13 // indirect
	modernc.org/libc v1.22.6 // indirect
	modernc.org/mathutil v1.5.0 // indirect
	modernc.org/memory v1.5.0 // indirect
	modernc.org/opt v0.1.3 // indirect
	modernc.org/sqlite v1.22.1 // indirect
	modernc.org/strutil v1.1.3 // indirect
	modernc.org/token v1.1.0 // indirect
)

// Hack to prevent the willf/bitset module from being upgraded to 1.2.0.
// They changed the module path from github.com/willf/bitset to
// github.com/bits-and-blooms/bitset and a couple of dependent repos are yet
// to update their module paths.
exclude (
	github.com/RoaringBitmap/roaring v0.7.0
	github.com/RoaringBitmap/roaring v0.7.1
	github.com/dyatlov/go-opengraph v0.0.0-20210112100619-dae8665a5b09
	github.com/willf/bitset v1.2.0
)

replace github.com/mattermost/mattermost-server/server/public => ./public
