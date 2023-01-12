<template>
  <div class="article-detail zpw-my-3">
    <a-skeleton :loading="loading" active avatar :paragraph="{ rows: 20 }">
      <article v-if="article">
        <header class="article__header zpw-flex zpw-items-center">
          <img class="avatar" src="@/assets/avatar.jpg" />
          <div class="article__infos">
            <span class="author">Tusi</span>
            <sup class="role-tag">博主</sup>
            <div>
              <time>发布于{{ formattedTime }}</time>
              <span class="read_total">阅读&nbsp;&nbsp;{{ article.read_num }}</span>
            </div>
          </div>
        </header>
        <main class="article__main">
            <a-image :src="article.poster" class="article__poster" fit="cover" />
            <h2>
              {{ article.article_name }}
            </h2>
            <section class="md-preview" v-html="purifiedContent"></section>
        </main>
        <div class="copyright">
          <p>
            本文链接：<a :href="postLink">{{ postLink }}</a>
            <br />
            版权声明：本文由<strong>Tusi</strong>原创，发表于{{ formattedTime }}，如需转载，请联系作者授权！
          </p>
        </div>
        <div class="reward__wrapper">
          <p class="reward__tips">您的支持将鼓励我继续创作！</p>
          <a-button type="primary" @click="isRewardVisible = true">赏</a-button>
        </div>
      </article>
    </a-skeleton>
  </div>
</template>
<script>
import marked from 'marked'
// hljs 按需加载
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/atom-one-dark.css'
import javascript from 'highlight.js/lib/languages/javascript'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import shell from 'highlight.js/lib/languages/shell'
import json from 'highlight.js/lib/languages/json'
import plaintext from 'highlight.js/lib/languages/plaintext'
import DOMPurify from 'dompurify'
import { defineComponent, ref, onMounted } from 'vue'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', html)
hljs.registerLanguage('css', css)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('json', json)
hljs.registerLanguage('plaintext', plaintext)
export default defineComponent({
  name: 'ArticleDetail',
  setup (props) {
    const loading = ref(false)
    const article = ref()
    article.value = {
      id: 243,
      article_name: '实现一个靠谱好用的全屏组件，顺手入门 Headless 组件',
      article_text: "> 本文为稀土掘金技术社区首发签约文章，14天内禁止转载，14天后未获授权禁止转载，侵权必究！\n>\n> 专栏上篇文章传送门：[衍生需求：按钮集成图标组件 & 图标选择器](https://juejin.cn/post/7166029886128128014)\n> \n> 本节涉及的内容源码可在[vue-pro-components c5 分支](https://github.com/cumt-robin/vue-pro-components/tree/c5)找到，欢迎 star 支持！\n\n# 前言\n\n本文是 [基于Vite+AntDesignVue打造业务组件库](https://juejin.cn/column/7140103979697963045 \"https://juejin.cn/column/7140103979697963045\") 专栏第 6 篇文章【实现一个靠谱好用的全屏组件，顺手入门 Headless 组件】，聊聊一个使用频率还挺高的组件——全屏组件，顺便了解下什么是 Headless 组件，并尝试动手将一个普通组件改造成 Headless 组件。\n\n# 全屏组件\n\n我们在项目中或多或少会用到进出全屏的功能，这样可以最大化利用可视区域，但是，实现一个完善的全屏功能并不简单。\n\n首先，各浏览器内核对于全屏 API 的实现不一样，你可能会看到诸如`requestFullscreen`, `webkitRequestFullScreen`, `mozRequestFullScreen`, `msRequestFullscreen`之类的进入全屏的方法，退出全屏的方法也不例外。\n\n其次，各浏览器中能用来判断全屏状态的属性和方法也不尽相同，比如`document.fullscreenElement`, `document.webkitFullscreenElement`等等，甚至有的情况下用`document.fullscreenElement`也无法准确反映全屏的状态，比如你在 Chrome, Edge, Firefox 等浏览器中通过 F11 按键进入全屏后，`document.fullscreenElement`的值会是`null`，并且`fullscreenchange`事件也不会触发；而通过调用`requestFullscreen()` API 进入全屏后，`document.fullscreenElement`的值就是正确的。\n\n对于做项目的开发者们来说，这种不一致就让人很恼火，因为我们仅靠`document.fullscreenElement`并不能确保在界面上可以反馈正确的状态，此时我们需要寻找一种方法 hack，解决这种不一致问题。\n\n![全屏状态不一致.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b576d07532684e308e6ca2ef86b51854~tplv-k3u1fbpfcp-watermark.image?)\n\n全屏/退出全屏的触发方式比较多，可能有通过按键`F11`, `ESC`等触发，也有可能通过监听某个界面元素的交互事件并结合全屏 API 触发，这会让全屏的状态判断变得更复杂。\n\n为了解决这些问题，我们有必要把这些繁琐和不确定性集中处理掉，对外提供干净、简洁、一致的 API。那么我们要做哪些事情呢？我想大概有以下几点：\n\n- 检测当前环境是否允许/支持全屏能力（对应`fullscreenEnabled`）。\n- 提供进入/退出全屏的 API（名字可以是`enterFullscreen`, `exitFullscreen`）。\n- 提供统一的判断全屏状态的方法（名字可以是`isFullscreen`）。\n- 提供获取全屏元素的方法（名字可以是`getFullscreenElement`）。\n- 提供监听/取消监听全屏事件的能力（名字可以是`subscribeFullscreenChange`, `unsubscribeFullscreenChange`）\n\n## 检测当前环境是否允许/支持全屏能力\n\n由于浏览器厂商的具体实现差异，可能会出现部分浏览器不支持全屏 API的情况，或者有提供某种配置或开关，能够做到启用/禁用全屏特性。因此最保险的做法是：在我们使用全屏 API 之前，做一次全屏特性支持度检测。\n\n检测的逻辑并不复杂，只要将标准的`fullscreenEnabled`用上，同时将浏览器前缀考虑在内即可。\n\n```\n/**\n * @description 判断浏览器当前状态是否允许启用全屏特性\n */\nexport function isFullscreenEnabled(): boolean {\n    return !!(document.fullscreenEnabled || document.webkitFullScreenEnabled || document.mozFullScreenEnabled || document.msFullScreenEnabled);\n}\n```\n\n## TypeScript 类型扩展\n\n但是我们可以发现，在使用 TypeScript 编写这部分代码时，IDE 会在类型上给我们抛出错误信息，这是因为标准的`lib.dom.d.ts`中没有声明带有各个浏览器前缀的 API，所以是不能直接用`webkitFullScreenEnabled`, `mozFullScreenEnabled`等方法的。\n\n![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4752a67e24b43df866a4a0550370a09~tplv-k3u1fbpfcp-watermark.image?)\n\n而为了照顾各种浏览器，我们又不得不写这些兼容代码。因此，我们需要对`interface Document`做一些扩展，使得扩展出来的类型能够支持调用`webkitFullScreenEnabled`等方法。\n\n考虑到`document`对象是浏览器运行时的全局属性，第一种做法是直接在`global`上扩展`Document`接口。\n\n```\ndeclare global {\n    interface Document {\n        webkitFullScreenEnabled?: boolean\n        mozFullScreenEnabled?: boolean\n        msFullScreenEnabled?: boolean\n    }\n}\n```\n\n在`.ts`文件中，通过`declare global`可以扩展全局类型，再依靠`interface`的 Merge 能力，我们就能对`Document`接口进行扩展，补充一些运行时特有的属性或方法。此时，我们可以观察到类型错误信息已经不存在。\n\n![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b8cb3b7ef4f4bf695596282c18d9abb~tplv-k3u1fbpfcp-watermark.image?)\n\n另一种做法是定义一个子类型（SubType）继承`Document`接口，我们把这个子类型命名为`EnhancedDocument`，再对这个子类型做扩展，接着用类型断言将`document`对象断言为`EnhancedDocument`类型。\n\n```\ninterface EnhancedDocument extends Document {\n    webkitFullScreenEnabled?: boolean\n    mozFullScreenEnabled?: boolean\n    msFullScreenEnabled?: boolean\n}\n```\n\n> Sometimes you will have information about the type of a value that TypeScript can’t know about.\n\n类型断言是一个从抽象到更具体的做法，有时候我们能知道一些 TypeScript 无法感知的类型信息。在 TypeScript 层面，它认为 document 就是 Document 类型，这是因为 TypeScript 无法确定具体的运行时环境是什么样的。而作为开发者，我们很清楚，当代码在浏览器执行时，它可能会有`webkitFullScreenEnabled`或`mozFullScreenEnabled`等可选属性（取决于浏览器实现），所以断言为`EnhancedDocument`类型也是合理的。\n\n![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72f7202f76494d1b873a3ac330baee6e~tplv-k3u1fbpfcp-watermark.image?)\n\n## 进入/退出全屏\n\n对于进入全屏而言，触发的目标元素可能是`document.body`，也可能是具体的某一个页面元素。考虑到调用[requestFullscreen](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen)会返回一个 Promise，我们可以将`enterFullscreen`封装为一个异步函数。\n\n```typescript\n/**\n * 进入全屏\n * https://developer.mozilla.org/zh-CN/docs/Web/API/Element/requestFullScreen\n * @param {EnhancedHTMLElement} [element=document.body] - 全屏目标元素，默认是 body\n * @param {FullscreenOptions} options - 全屏选项\n */\nexport async function enterFullscreen(element: EnhancedHTMLElement = document.body, options?: FullscreenOptions) {\n    try {\n        if (element.requestFullscreen) {\n            await element.requestFullscreen(options)\n        } else if (element.webkitRequestFullScreen) {\n            await element.webkitRequestFullScreen()\n        } else if (element.mozRequestFullScreen) {\n            await element.mozRequestFullScreen()\n        } else if (element.msRequestFullscreen) {\n            await element.msRequestFullscreen()\n        } else {\n            throw new Error('该浏览器不支持全屏API')\n        }\n    } catch (err) {\n        console.error(err)\n    }\n}\n```\n\n退出全屏有一点不一样，因为退出全屏的 API 只在 Document 接口中有定义，这一点可以参考[Fullscreen API Standard](https://fullscreen.spec.whatwg.org/)。\n\n![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e93d27f61fb406d808abfc56e76756b~tplv-k3u1fbpfcp-watermark.image?)\n\n退出全屏的代码封装如下：\n\n![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1d87e8050f64712acd95c050c832f59~tplv-k3u1fbpfcp-watermark.image?)\n\n其中有一个`webkitExitFullscreen`和`webkitCancelFullScreen`让我迷惑了一会，最后从 WebKit JS 的文档中了解到已经不建议使用`webkitCancelFullScreen`了。\n\n![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc5e4fc5bf584541bc293575e2679f28~tplv-k3u1fbpfcp-watermark.image?)\n\n为了避免写太多`as`类型断言，这里通过一个变量`doc`接收了`document`的值，同时将`doc`的类型声明为`EnhancedDocument`。\n\n![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/246d56ac93444015b20aa284776596fe~tplv-k3u1fbpfcp-watermark.image?)\n\n从类型兼容的角度看，`EnhancedDocument`是`Document`的子类型，一个父类型的值（document）赋给一个子类型的变量（doc）看起来似乎不是类型安全的，但是实际赋值过程中并没有报类型错误，这似乎有违我之前的认知。\n\n> 你可以把狗赋值给动物类型，但是不能把动物赋值给狗类型。这就符合类型安全。\n\n仔细观察后，我发现这是因为`EnhancedDocument`扩展的属性都是可选的，这种时候，TypeScript 会认为`EnhancedDocument`和`Document`是互相兼容的。从类型的使用上来看也是安全的，如果你要用到可选属性，必然少不了要用到类型守卫。\n\n一旦我们给`EnhancedDocument`增加一个必选属性，这种赋值就违背类型兼容了。\n\n![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dd8694be445461380bdd7a926a315d8~tplv-k3u1fbpfcp-watermark.image?)\n\n## 获取全屏元素\n\n获取全屏元素也只能通过`document`上的`fullscreenElement`属性取得，这在标准中也有定义。\n\n![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c61d88b6e0794b578b74b24181be9f9c~tplv-k3u1fbpfcp-watermark.image?)\n\n代码相对简单，封装如下：\n\n![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f50fffe124f445bcbcd134690f2867f8~tplv-k3u1fbpfcp-watermark.image?)\n\n## 判断全屏状态\n\n标准中没有告诉我们怎么判断全屏状态，但是我们可以在【获取全屏元素】的基础上得到启发。如果通过`getFullscreenElement`函数得到的结果不是`null`，就可以认为当前是全屏状态。\n\n```\n/**\n * @description 判断当前是否是全屏状态\n */\nexport function isFullscreen(): boolean {\n    return !!getFullscreenElement() || window.innerHeight === window.screen.height\n}\n```\n\n为了确保准确性，我还加了一个或的逻辑（判断视口高度和屏幕高度是否一致）。\n\n## 监听/取消监听全屏事件\n\n事件监听也不复杂，主要是将参数的支持做好，并且把浏览器兼容性考虑在内。\n\n![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5de4c561199e4e189ac0f433b87b2221~tplv-k3u1fbpfcp-watermark.image?)\n\n![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae42722df02e43548e9c37a783fd89ae~tplv-k3u1fbpfcp-watermark.image?)\n\n## 全屏状态一致性问题\n\n前面介绍了好几个应用层面的 API，但是我们还遗漏了一个重要问题，就是在上文中提到的 F11 按键和调用 API 的不一致问题，这会导致我们在获取全屏元素和判断全屏状态时都有可能出错。\n\n我的做法是：既然 F11 的行为与预期不一致，那我就将 F11 按键逻辑优化一下，禁止其默认行为（进入全屏），并根据当前是否是全屏状态调用`enterFullscreen()`或者`exitFullscreen()`。这样一来，就能保证进入全屏的入口都是通过 API 触发的，从而保证全屏状态的一致性。\n\n```\n/**\n * 阻止F11按键的默认行为，并根据当前的全屏状态调用进入/退出全屏，\n * 解决通过F11按键和API两种方式进入全屏时出现的状态不一致问题。\n */\nexport function patchF11DefaultAction(): void {\n    window.addEventListener('keydown', (e) => {\n        // https://w3c.github.io/uievents-code/\n        if (e.code === 'F11') {\n            e.preventDefault()\n            if (isFullscreen()) {\n                exitFullscreen()\n            } else {\n                enterFullscreen()\n            }\n        }\n    })\n}\n```\n\n如果您想了解全屏API更细致的内容，可以查阅[Fullscreen API Standard](https://fullscreen.spec.whatwg.org/)。\n\n## 封装为 Vue 组件\n\n对基础的全屏API做了封装后，我们就可以在此基础上封装一个全屏业务组件了。\n\n核心逻辑不复杂，主要是：\n\n- 根据当前是否是全屏状态，在 UI 上提供进入/退出全屏的能力。\n- 在适当的时机检查全屏状态，比如挂载/全屏事件触发后。\n- 提供函数类型的属性`getElement`，让调用者可以自由选择进入全屏的目标元素。之所以提供函数类型的`getElement`，是为了兼容 dom 异步挂载的情况。\n\n由于不同的项目可能对全屏这块的 UI 实现有不同的要求，这里就不细说了，唯一要注意的是全屏态的叠加问题，如果你希望控制 top layer 的叠加问题，就需要在逻辑中控制好进出全屏的顺序问题（比如先退出，再进入，保证只有一个全屏 layer）。注意看 body 和 div 标签右侧的 top-layer。\n\n![全屏top-layer叠加.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b92d1dee78cc420da19fa7efe8a47e35~tplv-k3u1fbpfcp-watermark.image?)\n\n如果你想要了解组件的具体实现，可以前往[源码](https://github.com/cumt-robin/vue-pro-components/blob/c5/packages/vue-pro-components/src/fullscreen/fullscreen.vue)查看。\n\n# Headless 组件\n\nHeadless 组件的概念可以类比于 Headless 浏览器，其核心是一种重逻辑、轻 UI 的思想。\n\n> 引用 TanStack Table 给出的介绍：\n>\n> **Headless UI** is a term for libraries and utilities that provide the logic, state, processing and API for UI elements and interactions, but **do not provide markup, styles, or pre-built implementations**.\n\n虽然各大流行组件库都提供了较为通用的样式，并且也能通过覆盖样式支持一定程度上的定制。但是，这种 UI 范式也很难满足复杂的定制需求，我们可能会有这样的困惑：\n\n- 明明逻辑很相似，我却无法复用这个组件，需要改源码或者重新开发一个新组件。\n- 这个组件很契合我的需求，需求做到一半时发现：就差一个 div 不能定制了，其他的都满足需求......\n- 本来 2 人天的需求，因为某个 UI 组件不可控，直接导致人天翻倍。\n\n对于业务开发者来说，我们可能会提出这样的诉求：组件库能不能在提供一套 UI 实现的同时，把组件的所有状态和 API 都开放出来，让我们有自行实现 UI 渲染的可能性呢？这在某种程度上和 Headless 组件的理念不谋而合。\n\n## 我对 Headless 的理解\n\n介绍 Headless 组件的文章也有不少了，这里简单谈谈我对 Headless 组件的一点粗浅的理解和看法。\n\n在我看来，Headless 组件适合的场景是：\n\n- 组件逻辑相对简单，但是 UI 通用性不强，经常需要根据业务需求定制 UI 的场景。\n- 组件逻辑很复杂，需要通过抽象来实现复用，但是服务的上层通常不是具体的业务项目，大概率是组件库。\n- 跨框架复用，状态和逻辑用纯 js 管理，上层应用再针对框架去做适配层。\n\n举实际的例子说明下：\n\n场景1：我要实现一个全屏组件，但是有的业务项目希望全屏组件**对应的 UI 是一个按钮**，有的业务项目希望是一个**图标**，有的希望是**图标 + 文字**，甚至有更多可能性......虽然在 UI 方面有**多样性**的需求，但是**底层逻辑都是一样或类似**的，无非就是控制进出全屏、监听全屏的状态等。这种时候，提供一个可复用的 Hook 或者 Headless 组件是值得考虑的。\n\n场景2；我所在的公司是字节挑逗（瞎编的），公司有两个子品牌，一个是 dy，一个是 tt，两个团队都有一套组件库，都实现了比较复杂的 Table, Form 等组件，并且都服务了很多个上层业务，可能从直观上看，两套组件库主要是 UI 长得有点不一样，但是底层逻辑差不多。此时，我希望**两个品牌方团队能共用一套逻辑实现组件库，将关键逻辑下沉**。那么 Headless 组件可能是一个解决方案。\n\n场景3：我所在的公司是字节挑逗，公司的前端框架既有 Vue，也有 React，在这两套框架之上，都实现了对应的组件库，此时我想把逻辑下沉实现更大程度复用，**状态和逻辑不再依赖任何框架**（纯 js 撸一套，可能再用个类封装下），而在具体的框架之上再做**适配**工作（将**底层封装好的状态和逻辑**与**框架中的状态/属性/事件等概念**结合起来）。当然，这**也适用于跨平台的场景**。\n\nHeadless 是**直接服务业务方**，还是**服务特定框架下的 UI 组件库**，亦或是**对接框架或平台的适配层**，都是有可能的，这需要结合实际场景来考虑。Headless 不是万能和普适的，但确实给我们提供了一个新的值得探索的思路。\n\n## 开发一个 Headless 组件\n\n虽然 Headless 组件也火了一段时间了，但是目前在社区中还没有形成对 Headless 的共识，没有一个我们公认为**最佳实践**的做法。我们的第一个问题可能是：我开发的 Headless 组件要对外输出什么内容？是一个组件，还是一段逻辑？\n\n从 Headless 组件的中心思想——**逻辑层与表现层解耦**（具体表现为：内部封装状态和逻辑，对外支持 UI 的高度定制化）来看，这似乎与 Render Props / 作用域插槽 / Hooks 等概念有一定的相似性。如果要跨框架或者跨平台，Headless 组件可能也是纯 JS 的。这就决定了 Headless 组件并不是拘泥于某一种特定的形式，从现在社区中有的一些产品中，我们也能看出一些端倪。\n\n- 比如 Semi Design 就将一个组件分为了 Foundation 和 Adapter 部分，Foundation 负责实现组件通用的 JS 逻辑，Adapter 则是针对各个前端框架的适配层。\n\n![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ceb99297116455dbefb606c33151456~tplv-k3u1fbpfcp-watermark.image?)\n\n- [React Hook Form](https://react-hook-form.com/)也是一种 Headless 的实现，其在 Hook 内部把表单的核心逻辑都实现了，对外提供了状态，方法等，你只要拿着暴露出来的状态和 API，与视图做交互即可，这样一来，你可以在表单 UI 的实现上发挥充分的想象力，而不是局限于修改 css 或者拿着几个有限的 Render Props 做定制。\n\n![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d6f64d2a7054410b9cfbadd8e22f8f1~tplv-k3u1fbpfcp-watermark.image?)\n\n- 还有直接挂上 Headless 招牌的 TanStack Table。\n\n![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41dff1655b43428487658d602cf33b8a~tplv-k3u1fbpfcp-watermark.image?)\n\nTanStack Table 在底层用纯 JS 实现了通用的 core 核心，并在上层提供了各大前端框架的 Adapter，当然你也可以选择直接用它的核心模块`createTable`。\n\n![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dadf25bf144b4415a2970574a7356189~tplv-k3u1fbpfcp-watermark.image?)\n\n以 Vue 为例，对外提供的`useVueTable`就是将`createTable`核心与 Vue 的各个 API 做了 binding。\n\n![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd87d88ebf414a56b4203bc79041716c~tplv-k3u1fbpfcp-watermark.image?)\n\n你可能会认为这跟 Hooks 之类的没有区别，这无可厚非，它们确实很相似。不过换个角度看，你可以认为 Hooks 之类的技术底座，是实现 Headless 组件的一种方式或者途径，但是它们并不是严格意义上的一回事。\n\n以我们目前实现的这个全屏组件而言，其实它最适合的 Headless 形式是 Hook。首先，我做的这个组件库是面向 Vue 框架的，并不需要像 Semi Design 或者 TanStack Table 这类方案一般提供 JS 层面的抽象。因此，我们借助 Vue Composition API，就能很快抽象出一个可复用的 Headless 组件，这样一来，业务方基于此就能很快定制出自己想要的 UI 效果。\n\n> 说了一圈，好像又陷入僵局了。额，Headless 可以是 Hook，也可以不是，不要纠结。\n\n那么我们就以这个全屏组件为例说说，怎么做一个 Headless 组件。\n\n不管 UI 怎么变，其实只关注两个事情：\n\n- 当前是否为全屏状态\n- 切换全屏状态的 API\n\n所以，我们可以把逻辑抽象成这样，对外只暴露`isTargetFullscreen`和`toggleFullscreen`即可：\n\n![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3354dcf7e0cf4aedb5a5fe5c9753989a~tplv-k3u1fbpfcp-watermark.image?)\n\n这样一来，我们封装的全屏组件就能以这个 Hook 为基础简化：\n\n![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5b767f1ce324c86a81ddacbdeff054f~tplv-k3u1fbpfcp-watermark.image?)\n\n同时，外部也可以直接使用`@vue-pro-components/headless`提供的`useFullscreen`能力，实现 UI 自主可控（比如用一个开关组件承载全屏能力）。\n\n![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04511af35001421aa86ed567adb7cc86~tplv-k3u1fbpfcp-watermark.image?)\n\n![useFullscreen.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e721d092d0f4552ad069cd8b24d4df5~tplv-k3u1fbpfcp-watermark.image?)\n\n# 结语\n\n本文和前2篇文章都聚焦于**怎么实现基础的复杂度不高的业务组件**，看起来可能有点枯燥乏味，但也是为了**打个基础，引导部分还不太熟悉组件开发的读者慢慢进入状态，掌握组件开发的一些基本思想**。实际上，**开发组件**和**发布可用的组件**之间还**隔着一条鸿沟**，这就是从开发环境到生产环境必经的路，也是组件库研发过程中最复杂的部分。要越过这条鸿沟，就必须掌握一些工程化能力。如果您对我的专栏感兴趣，欢迎您[订阅关注本专栏](https://juejin.cn/column/7140103979697963045 \"https://juejin.cn/column/7140103979697963045\")，接下来可以一同探讨和交流组件库开发过程中遇到的问题。",
      create_time: '2023-01-05T12:51:00.000Z',
      update_time: null,
      author_id: 1,
      read_num: 13,
      like_num: 0,
      summary: '聊聊一个使用频率还挺高的组件——全屏组件，顺便了解下什么是 Headless 组件，并尝试动手将一个普通组件改造成 Headless 组件。',
      poster: 'https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d158b670810c4830a267fc2d21abcf7e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?',
      private: 0,
      deleted: 0,
      author: 'Tusi',
      categories: [{
        id: 170,
        categoryName: 'vue'
      }, {
        id: 192,
        categoryName: '掘金专栏'
      }],
      tags: [{
        id: 231,
        tagName: 'Headless'
      }, {
        id: 232,
        tagName: '全屏组件'
      }]
    }

    const setMarkedOptions = () => {
      const renderer = new marked.Renderer()
      renderer.link = function customLink (href, title, text) {
        return `<a class="link" href="${href}" target="_blank" title="${text}">${text}</a>`
      }
      renderer.image = function customImage (href, title, text) {
        return (
                    `<a class="img-wrapper" href="${href}" target="_blank" title="${text}">` + `<img src="${href}" alt="${text}">` + '</a>'
        )
      }
      marked.setOptions({
        renderer,
        highlight: function (code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        },
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      })
    }

    onMounted(() => {
      setMarkedOptions()
    })

    const markedContent = marked(article.value.article_text)
    const purifiedContent = ref('')
    // 防XSS
    purifiedContent.value = DOMPurify.sanitize(markedContent)
    return {
      article,
      loading,
      purifiedContent
    }
  }
})
</script>
<style lang="scss" scoped>
.article-detail {
  .avatar {
    width: 48px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .article__infos {
    margin-left: 14px;
    display: inline-block;
    vertical-align: top;
    color: #999;
    font-size: 14px;
    .author {
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }
    .role-tag {
      margin-left: 6px;
      background: #1989fa;
      padding: 0 4px;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      display: inline-block;
      line-height: 1.5;
    }
    .read_total {
      margin-left: 8px;
    }
  }
  .article__main {
    > h2 {
      margin: 0 0 0.6em 0;
      font-size: 1.8em;
    }
  }
}
</style>
<style lang="scss" scoped src="./md-render.scss"></style>
