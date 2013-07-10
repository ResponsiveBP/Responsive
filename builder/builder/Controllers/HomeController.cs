// --------------------------------------------------------------------------------------------------------------------
// <copyright file="HomeController.cs" company="James South">
//   Copyright James South
// </copyright>
// <summary>
//   The home controller.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace builder.Controllers
{
    #region Using

    using System;
    using System.IO;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Mvc;
    #endregion

    /// <summary>
    /// The home controller.
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// The index.
        /// </summary>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        public ActionResult Index()
        {
            return this.View();
        }

        /// <summary>
        /// The responsive css.
        /// </summary>
        /// <returns>
        /// The <see cref="FileStreamResult"/>.
        /// </returns>
        public FileStreamResult Responsive()
        {
            FileStreamResult fileStreamResult;

            Uri uri = this.ControllerContext.HttpContext.Request.Url;
            string leftPart = uri.GetLeftPart(UriPartial.Authority);
            Uri cssUri = new Uri(leftPart + "/css.axd?path=responsive.css");

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(cssUri);
            Stream stream = request.GetResponse().GetResponseStream();

            return new FileStreamResult(stream, "text/css")
                       {
                           FileDownloadName = "responsive.css"
                       };
        }

        /// <summary>
        /// The responsive css.
        /// </summary>
        /// <returns>
        /// The <see cref="FileStreamResult"/>.
        /// </returns>
        public FileStreamResult ResponsiveLegacy()
        {
            FileStreamResult fileStreamResult;

            Uri uri = this.ControllerContext.HttpContext.Request.Url;
            string leftPart = uri.GetLeftPart(UriPartial.Authority);
            Uri cssUri = new Uri(leftPart + "/css.axd?path=responsive-legacy.css");

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(cssUri);
            Stream stream = request.GetResponse().GetResponseStream();

            return new FileStreamResult(stream, "text/css")
            {
                FileDownloadName = "responsive-legacy.css"
            };
        }

        /// <summary>
        /// The responsive JavaScript.
        /// </summary>
        /// <returns>
        /// The <see cref="FileStreamResult"/>.
        /// </returns>
        public FileStreamResult ResponsiveJS()
        {
            FileStreamResult fileStreamResult;

            Uri uri = this.ControllerContext.HttpContext.Request.Url;
            string leftPart = uri.GetLeftPart(UriPartial.Authority);
            Uri javaScriptUri = new Uri(leftPart + "/js.axd?path=responsive.utils.js|responsive.autosize.js|responsive.carousel.js|responsive.dismiss.js|responsive.dropdown.js|responsive.lightbox.js|responsive.tabs.js");

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(javaScriptUri);
            Stream stream = request.GetResponse().GetResponseStream();

            return new FileStreamResult(stream, "text/javascript")
            {
                FileDownloadName = "responsive.js"
            };
        }
    }
}
