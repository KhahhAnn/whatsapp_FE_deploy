// Tại plugins/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core'

// Import các icon mà bạn muốn dùng

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'

import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// Thêm các icon vào thư viện
library.add(
  faEllipsisVertical,
  faDownload,
  faPhone,
  faVideo,
  faEllipsis,
  faCirclePlus,
  faImage,
  faNoteSticky,
  faPaperPlane
)
